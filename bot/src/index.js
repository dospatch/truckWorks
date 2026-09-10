const {
    Client,
    GatewayIntentBits,
    Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const config = require("./config");

const {
    handleInteraction
} = require("./handlers/interactionHandler");

const {
    handleDMMessage
} = require("./utils/staffApplicationManager");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

client.commands = new Collection();

/*
 * ==========================================
 * LOAD COMMANDS RECURSIVELY
 * ==========================================
 */

const commandsPath = path.join(__dirname, "commands");

function loadCommands(directory) {
    if (!fs.existsSync(directory)) {
        return;
    }

    const entries = fs.readdirSync(directory, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const fullPath = path.join(
            directory,
            entry.name
        );

        if (entry.isDirectory()) {
            loadCommands(fullPath);
            continue;
        }

        if (!entry.name.endsWith(".js")) {
            continue;
        }

        try {
            const command = require(fullPath);

            if (
                command &&
                command.data &&
                command.execute
            ) {
                client.commands.set(
                    command.data.name,
                    command
                );

                console.log(
                    `[COMMAND] Loaded /${command.data.name}`
                );
            }
        } catch (error) {
            console.error(
                `[COMMAND] Failed to load ${fullPath}`,
                error
            );
        }
    }
}

loadCommands(commandsPath);

/*
 * ==========================================
 * BOT READY
 * ==========================================
 */

client.once("clientReady", () => {
    console.log("");
    console.log("========================================");
    console.log("       BC TRUCKING WORKS BOT");
    console.log("========================================");
    console.log(`Logged in as: ${client.user.tag}`);
    console.log(`Servers: ${client.guilds.cache.size}`);
    console.log(`Commands: ${client.commands.size}`);
    console.log("========================================");
    console.log("");
});

/*
 * ==========================================
 * INTERACTIONS
 * ==========================================
 */

client.on(
    "interactionCreate",
    async interaction => {
        try {
            /*
             * Buttons, select menus and modals
             */
            if (
                interaction.isStringSelectMenu() ||
                interaction.isModalSubmit() ||
                interaction.isButton()
            ) {
                await handleInteraction(
                    interaction
                );

                return;
            }

            /*
             * Slash commands
             */
            if (
                !interaction.isChatInputCommand()
            ) {
                return;
            }

            const command =
                client.commands.get(
                    interaction.commandName
                );

            if (!command) {
                console.error(
                    `[COMMAND] Unknown command: /${interaction.commandName}`
                );

                if (
                    !interaction.replied &&
                    !interaction.deferred
                ) {
                    await interaction.reply({
                        content:
                            "❌ This command could not be found."
                    });
                }

                return;
            }

            await command.execute(
                interaction
            );
        } catch (error) {
            console.error(
                "[INTERACTION ERROR]",
                error
            );

            try {
                if (
                    interaction.replied ||
                    interaction.deferred
                ) {
                    await interaction.followUp({
                        content:
                            "❌ Something went wrong while processing your request.",
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content:
                            "❌ Something went wrong while processing your request.",
                        ephemeral: true
                    });
                }
            } catch {
                // Ignore secondary interaction errors.
            }
        }
    }
);

/*
 * ==========================================
 * STAFF APPLICATION DM HANDLER
 * ==========================================
 */

client.on(
    "messageCreate",
    async message => {
        try {
            await handleDMMessage(message);
        } catch (error) {
            console.error(
                "[DM HANDLER ERROR]",
                error
            );
        }
    }
);

/*
 * ==========================================
 * CLIENT ERROR
 * ==========================================
 */

client.on("error", error => {
    console.error(
        "[DISCORD CLIENT ERROR]",
        error
    );
});

/*
 * ==========================================
 * LOGIN
 * ==========================================
 */

if (!config.token) {
    console.error(
        "❌ DISCORD_TOKEN is missing from bot/.env"
    );

    process.exit(1);
}

client.login(config.token);
