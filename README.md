# Slack Approval Bot

This is a Slack bot that allows users to request approvals from other team members. The bot interacts with Slack via slash commands and interactive message buttons.

## DIAGRAM
https://app.eraser.io/workspace/RvRqQKwANpYHAaEdhBoP?origin=share

## Features
- Users can trigger an approval request using `/approval-test`.
- Approvers receive a message with `Approve` and `Reject` buttons.
- The bot notifies the requester when an action is taken.
- Approval messages update dynamically to show the final decision.

## Prerequisites
- Node.js installed (`>= 14.x` recommended)
- A Slack workspace and a Slack bot token

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/iamshibamnaskar/Slack-Approver-Bot.git
   cd Slack-Approver-Bot
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```ini
   SLACK_BOT_TOKEN=your-slack-bot-token
   PORT=3000
   ```

4. Start the server:
   ```sh
   node server.js
   ```

## Slack App Setup

1. Create a Slack App at [Slack API Dashboard](https://api.slack.com/apps).
2. Enable "Interactivity & Shortcuts" and set the request URL to: `https://your-server.com/slack/interactions`
3. Add the following OAuth Scopes:
   - `chat:write`
   - `commands`
   - `users:read`
4. Install the app to your workspace and obtain the `SLACK_BOT_TOKEN`.
5. Register the `/approval-test` slash command with request URL: `https://your-server.com/slack/commands`

## Routes

### `POST /slack/commands`
Handles Slack slash commands and opens the approval modal.

### `POST /slack/interactions`
Processes user interactions (approve/reject buttons) and updates messages accordingly.

Now you're ready to use the Slack Approval Bot! 🚀

