require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const slackCommands = require("./routes/slackCommands");
const slackInteractions = require("./routes/slackInteractions");

const app = express();

//getting port to run server from env
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  Use the Slack bot Routes
app.use("/slack/commands", slackCommands);
app.use("/slack/interactions", slackInteractions);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
