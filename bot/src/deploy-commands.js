const {
    REST,
    Routes
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const config = require("./config");

const commands = [];
const commandsRoot = path.join(
    __dirname,
    "commands"
);

function loadCommands(directory) {
    if (!fs.existsSync(directory)) {
        return;
    }

    const entries = fs.readdirSync(
        directory,
        {
            withFileTypes: true
        }
    );

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
                !command.data ||
                !command.execute
            ) {
                console.warn(
                    `⚠️ Invalid command: ${fullPath}`
                );
                continue;
            }

            commands.push(
                command.data.toJSON()
            );
        } catch (error) {
            console.error(
                `❌ Failed loading: ${fullPath}`,
                error
            );
        }
    }
}

loadCommands(commandsRoot);

const commandNames = commands.map(
    command => command.name
);

const duplicates =
    commandNames.filter(
        (name, index) =>
            commandNames.indexOf(name) !== index
    );

if (duplicates.length) {
    console.error(
        "❌ Duplicate commands detected:",
        [...new Set(duplicates)]
    );

    process.exit(1);
}

if (!config.token) {
    console.error(
        "❌ DISCORD_TOKEN is missing."
    );

    process.exit(1);
}

if (!config.clientId) {
    console.error(
        "❌ DISCORD_CLIENT_ID is missing."
    );

    process.exit(1);
}

if (!config.guildId) {
    console.error(
        "❌ DISCORD_GUILD_ID is missing."
    );

    process.exit(1);
}

const rest = new REST({
    version: "10"
}).setToken(config.token);

(async () => {
    try {
        console.log(
            "================================="
        );

        console.log(
            `🔄 Registering ${commands.length} command(s)...`
        );

        console.log(
            "================================="
        );

        await rest.put(
            Routes.applicationGuildCommands(
                config.clientId,
                config.guildId
            ),
            {
                body: commands
            }
        );

        console.log(
            `✅ Successfully registered ${commands.length} command(s)!`
        );

        console.log(
            "================================="
        );
    } catch (error) {
        console.error(
            "❌ Failed to register commands:",
            error
        );

        process.exit(1);
    }
})();
