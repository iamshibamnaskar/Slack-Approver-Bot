const express = require("express");
const { WebClient } = require("@slack/web-api");
require("dotenv").config();

const router = express.Router();
// initialize client with bot token from env
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Slash Command Handler
router.post("/", async (req, res) => {
    try {
        const { command, trigger_id } = req.body;

        if (command === "/approval-test") {

            //opening a modal popup for required details
            await slackClient.views.open({
                trigger_id,
                view: {
                    type: "modal",
                    callback_id: "approval_modal",
                    title: { type: "plain_text", text: "Request Approval" },
                    blocks: [
                        {
                            type: "input",
                            block_id: "approver_select",
                            element: {
                                type: "users_select",
                                action_id: "approver",
                            },
                            label: { type: "plain_text", text: "Select Approver" },
                        },
                        {
                            type: "input",
                            block_id: "approval_text",
                            element: {
                                type: "plain_text_input",
                                action_id: "approval_reason",
                            },
                            label: { type: "plain_text", text: "Approval Reason" },
                        },
                    ],
                    submit: { type: "plain_text", text: "Submit" },
                },
            });

            res.status(200).send(); // response
        }
    } catch (error) {
        console.error("Error in /commands:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
