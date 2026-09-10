const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View all available TruckWorks commands."),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("🚛 TruckWorks Bot")
            .setDescription(
                "Welcome to the **TruckWorks** bot!\n\n" +
                "Use the commands below to interact with the TruckWorks community."
            )
            .addFields(
                {
                    name: "🟢 General",
                    value:
                        "`/ping` — Check bot status\n" +
                        "`/help` — View available commands\n" +
                        "`/serverinfo` — View server information\n" +
                        "`/userinfo` — View member information"
                },
                {
                    name: "🔴 Administration",
                    value:
                        "`/setup` — Configure TruckWorks systems\n" +
                        "`/announce` — Create an announcement\n" +
                        "`/clear` — Delete messages\n" +
                        "`/slowmode` — Configure channel slowmode\n" +
                        "`/lock` — Lock a channel\n" +
                        "`/unlock` — Unlock a channel"
                },
                {
                    name: "🛡️ Moderation",
                    value:
                        "`/warn` — Warn a member\n" +
                        "`/warnings` — View member warnings\n" +
                        "`/kick` — Kick a member\n" +
                        "`/ban` — Ban a member\n" +
                        "`/unban` — Unban a member\n" +
                        "`/timeout` — Timeout a member\n" +
                        "`/untimeout` — Remove a timeout"
                },
                {
                    name: "🚛 TruckWorks",
                    value:
                        "`/vtc` — VTC information\n" +
                        "`/drivers` — View drivers\n" +
                        "`/driver` — View driver information\n" +
                        "`/events` — View TruckWorks events\n" +
                        "`/convoy` — Convoy information\n" +
                        "`/mods` — View supported mods\n" +
                        "`/servers` — View TruckWorks servers"
                },
                {
                    name: "💬 Community",
                    value:
                        "`/suggest` — Submit a suggestion\n" +
                        "`/bugreport` — Report a bug\n" +
                        "`/apply` — View applications\n" +
                        "`/ticket` — Open a support ticket"
                }
            )
            .setFooter({
                text: "TruckWorks • Discord Bot"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};