const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("events")
        .setDescription("View upcoming TruckWorks events."),

    async execute(interaction) {
        const events = await interaction.guild.scheduledEvents.fetch();

        const upcoming = [...events.values()]
            .filter(event => event.status === 1)
            .sort((a, b) =>
                a.scheduledStartTimestamp - b.scheduledStartTimestamp
            )
            .slice(0, 10);

        if (!upcoming.length) {
            return interaction.reply({
                content: "📅 There are currently no upcoming TruckWorks events.",
                ephemeral: true
            });
        }

        const description = upcoming
            .map(event =>
                `### ${event.name}\n` +
                `📅 <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:F>\n` +
                `⏱️ <t:${Math.floor(event.scheduledStartTimestamp / 1000)}:R>\n` +
                `${event.description || "No description provided."}`
            )
            .join("\n\n");

        const embed = new EmbedBuilder()
            .setTitle("📅 TruckWorks Events")
            .setDescription(description)
            .setFooter({
                text: "TruckWorks • Upcoming Events"
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
