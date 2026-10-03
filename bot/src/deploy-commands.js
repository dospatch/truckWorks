const { REST, Routes } = require("discord.js");
const config = require("./config");
const setupCommand = require("./commands/setup");
const statusCommand = require("./commands/status");
const truckworksCommand = require("./commands/truckworks");
const telemetryCommand = require("./commands/telemetry");

if (!config.token || !config.clientId || !config.guildId) {
  console.error("❌ DISCORD_TOKEN, DISCORD_CLIENT_ID, and DISCORD_GUILD_ID are required in bot/.env");
  process.exit(1);
}

const commands = [
  setupCommand.data.toJSON(),
  statusCommand.data.toJSON(),
  truckworksCommand.data.toJSON(),
  telemetryCommand.data.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("========================================");
    console.log("   BC TRUCK WORKS COMMAND DEPLOYMENT");
    console.log("========================================");
    console.log("Application ID: " + config.clientId);
    console.log("Guild ID: " + config.guildId);
    console.log("Commands: " + commands.map((command) => "/" + command.name).join(", "));

    const result = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log("✅ Registered " + result.length + " guild command(s).");
    console.log("========================================");
  } catch (error) {
    console.error("❌ Command deployment failed:");
    console.error(error);
    process.exit(1);
  }
})();
