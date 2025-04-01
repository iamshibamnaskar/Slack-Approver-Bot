const express = require("express");
const { WebClient } = require("@slack/web-api");
require("dotenv").config();

const router = express.Router();

// initialize client with bot token from env
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Interaction Handler
router.post("/", async (req, res) => {
    try {
        const payload = JSON.parse(req.body.payload);

        if (payload.type === "view_submission" && payload.view.callback_id === "approval_modal") {
            res.json({ response_action: "clear" });

            const approver = payload.view.state.values.approver_select.approver.selected_user;
            const approvalText = payload.view.state.values.approval_text.approval_reason.value;
            const requester = payload.user.id;

            
            //sewnding APPROVAL request to APPROVER
            try {
                await slackClient.chat.postMessage({
                    channel: approver,
                    text: `Approval Request from <@${requester}>:\n${approvalText}`,
                    attachments: [
                        {
                            text: "Do you approve?",
                            callback_id: "approval_response",
                            actions: [
                                {
                                    name: "approve",
                                    text: "Approve",
                                    type: "button",
                                    value: `approve_${requester}`,
                                    style: "primary",
                                },
                                {
                                    name: "reject",
                                    text: "Reject",
                                    type: "button",
                                    value: `reject_${requester}`,
                                    style: "danger",
                                },
                            ],
                        },
                    ],
                });

                console.log(`Approval request sent to ${approver}`);
            } catch (error) {
                console.error("Error sending message to approver:", error);
            }
            return;
        }

        if (payload.type === "interactive_message" || payload.type === "block_actions") {
            res.status(200).send();

            const action = payload.actions[0];
            const [decision, requester] = action.value.split("_");

            

            console.log(`Action: ${decision} by ${payload.user.id} for requester ${requester}`);
            //formating the messege as decision
            const message =
                decision === "approve"
                    ? `Your request has been *approved* by <@${payload.user.id}> ✅`
                    : `Your request has been *rejected* by <@${payload.user.id}> ❌`;

            try {
                //Sending Accept Or Reject messege to teh REQUESTER
                await slackClient.chat.postMessage({
                    channel: requester,
                    text: message,
                });
                //updating the APPROVAL messege in APPROVER chat
                await slackClient.chat.update({
                    channel: payload.channel.id,
                    ts : payload.original_message.ts,
                    attachments: [],
                    text: `${decision === "approve" ? "Approved ✅" : "Rejected ❌"} <@${requester}>`
                })

                console.log(`Notified requester ${requester}: ${message}`);
            } catch (error) {
                console.error("Error notifying requester:", error);
            }
        }
    } catch (error) {
        console.error("Error in /interactions:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
