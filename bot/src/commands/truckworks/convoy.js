const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("convoy")
        .setDescription("View upcoming TruckWorks convoy information."),

    async execute(interaction) {
        const events = await interaction.guild.scheduledEvents.fetch();

        const convoys = [...events.values()]
            .filter(event =>
                event.status === 1 &&
                event.name.toLowerCase().includes("convoy")
            )
            .sort((a, b) =>
                a.scheduledStartTimestamp - b.scheduledStartTimestamp
            )
            .slice(0, 5);

        if (!convoys.length) {
            const embed = new EmbedBuilder()
                .setTitle("🚛 TruckWorks Convoys")
                .setDescription(
                    "There are currently no scheduled convoys.\n\n" +
                    "Keep an eye on the TruckWorks Discord for the next convoy announcement."
                )
                .setFooter({
                    text: "TruckWorks • Convoy System"
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });
        }

        const description = convoys
            .map(event =>
                `### 🚛 ${event.name}\n` +
                `📅 <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:F>\n` +
                `⏱️ <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:R>\n` +
                `${event.description || "No additional information."}`
            )
            .join("\n\n");

        const embed = new EmbedBuilder()
            .setTitle("🚛 Upcoming TruckWorks Convoys")
            .setDescription(description)
            .setFooter({
                text: "TruckWorks • Convoy System"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
