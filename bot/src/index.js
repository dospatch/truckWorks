const { Client, GatewayIntentBits, Collection } = require("discord.js");
const config = require("./config");
const setupCommand = require("./commands/setup");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(setupCommand.data.name, setupCommand);

client.once("clientReady", () => {
  console.log("");
  console.log("========================================");
  console.log("        BC TRUCK WORKS DISCORD BOT");
  console.log("========================================");
  console.log(`Logged in as: ${client.user.tag}`);
  console.log(`Server count: ${client.guilds.cache.size}`);
  console.log(`Loaded commands: ${client.commands.size}`);
  console.log("========================================");

  client.user.setPresence({
    activities: [{ name: "BC TRUCK WORKS • ATS / ETS2", type: 0 }],
    status: "online",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return interaction.reply({
      content: "❌ That command is not available.",
      ephemeral: true,
    });
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("[COMMAND ERROR]", error);

    const message = "❌ The command failed. Check the bot console for details.";

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: message, ephemeral: true }).catch(() => null);
    } else {
      await interaction.reply({ content: message, ephemeral: true }).catch(() => null);
    }
  }
});

client.on("error", (error) => {
  console.error("[DISCORD ERROR]", error);
});

if (!config.token) {
  console.error("❌ DISCORD_TOKEN is missing from bot/.env");
  process.exit(1);
}

if (!config.clientId) {
  console.error("❌ DISCORD_CLIENT_ID is missing from bot/.env");
  process.exit(1);
}

if (!config.guildId) {
  console.error("❌ DISCORD_GUILD_ID is missing from bot/.env");
  process.exit(1);
}

client.login(config.token);
