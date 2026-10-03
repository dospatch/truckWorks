const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.join(__dirname, "../.env")
});

const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
    websiteUrl: process.env.TRUCKWORKS_WEBSITE_URL || "https://truck-works.vercel.app"
};

module.exports = config;