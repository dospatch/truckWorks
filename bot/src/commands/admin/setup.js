const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

const {
    ensureServerStructure
} = require("../../utils/serverStructure");

const {
    deployAllEmbedTemplates
} = require("../../utils/embedDeployer");

const {
    setupTicketSystem
} = require("../../utils/setupTickets");

const {
    createSupportCenterEmbeds,
    createSupportCenterMenu
} = require("../../config/ticketPanel");

const {
    sendApplicationPanel,
    ensureReviewChannel
} = require("../../utils/staffApplicationManager");

const {
    ensureApplicationRequirementsChannels
} = require("../../utils/applicationRequirementsChannels");


/*
 * ============================================================
 * 🚛 TRUCKWORKS SUPPORT CENTER
 * ============================================================
 */

async function sendTruckWorksSupportCenter(channel) {
    if (!channel) {
        throw new Error(
            "Support Center channel could not be resolved."
        );
    }

    const embeds = createSupportCenterEmbeds();
    const menu = createSupportCenterMenu();

    /*
     * Remove previous bot-generated Support Center panels.
     */

    try {
        const messages = await channel.messages.fetch({
            limit: 100
        });

        const oldPanels = messages.filter(message =>
            message.author.id === channel.client.user.id &&
            message.embeds.some(embed =>
                String(embed.title || "")
                    .includes("TRUCKWORKS SUPPORT CENTER")
            )
        );

        for (const message of oldPanels.values()) {
            await message.delete().catch(() => {});
        }

    } catch (error) {
        console.warn(
            "⚠️ Could not clean previous Support Center panels:",
            error.message
        );
    }

    /*
     * Send Support Center embeds.
     */

    for (const embed of embeds) {
        await channel.send({
            embeds: [embed]
        });
    }

    /*
     * Send interactive ticket menu.
     */

    await channel.send({
        content:
            "🎫 **Select a support category below to open a private TruckWorks support ticket.**",
        components: [menu]
    });

    console.log(
        `✅ TruckWorks Support Center deployed in #${channel.name}`
    );
}


/*
 * ============================================================
 * 🔎 FIND SUPPORT CENTER CHANNEL
 * ============================================================
 */

function findSupportCenterChannel(guild) {
    const possibleNames = [
        "create-ticket",
        "create-tickets",
        "ticket",
        "tickets"
    ];

    return guild.channels.cache.find(channel => {
        if (!channel.isTextBased()) {
            return false;
        }

        const name = String(channel.name || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        return possibleNames.some(possible => {
            const normalized = possible
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

            return (
                name === normalized ||
                name.includes(normalized)
            );
        });
    });
}


/*
 * ============================================================
 * 🚛 SETUP COMMAND
 * ============================================================
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription(
            "Configure the complete TruckWorks Discord server."
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        ),

    async execute(interaction) {

        /*
         * ========================================================
         * ACKNOWLEDGE COMMAND
         * ========================================================
         */

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const guild = interaction.guild;

        if (!guild) {
            await interaction.editReply({
                content:
                    "❌ This command can only be used inside a Discord server."
            });

            return;
        }


        /*
         * ========================================================
         * SETUP RESULTS
         * ========================================================
         */

        let structureResults = {
            categoriesCreated: 0,
            categoriesExisting: 0,
            channelsCreated: 0,
            channelsExisting: 0,
            channelsMoved: 0,
            errors: []
        };

        let applicationRequirementsResult = {
            categoryCreated: false,
            categoryName: "application-requirements",
            channelsCreated: [],
            channelsExisting: [],
            channelsMoved: [],
            errors: []
        };

        let ticketResult = null;

        let embedResults = [];

        let supportCenterResult = false;

        let staffApplicationResult = false;

        let reviewChannelResult = false;


        /*
         * ========================================================
         * STEP 1 — SERVER STRUCTURE
         * ========================================================
         */

        try {

            structureResults =
                await ensureServerStructure(guild);

            console.log(
                "✅ TruckWorks server structure configured."
            );

            console.log(
                `📁 Categories created: ${structureResults.categoriesCreated}`
            );

            console.log(
                `📝 Channels created: ${structureResults.channelsCreated}`
            );

        } catch (error) {

            console.error(
                "❌ Server structure setup failed:",
                error
            );

            structureResults.errors.push({
                type: "structure",
                error: error.message
            });
        }


        /*
         * ========================================================
         * STEP 2 — APPLICATION REQUIREMENTS
         * ========================================================
         */

        try {

            applicationRequirementsResult =
                await ensureApplicationRequirementsChannels(
                    guild
                );

            console.log(
                "📋 Application Requirements channels configured."
            );

            console.log(
                `📋 Requirement channels created: ${
                    applicationRequirementsResult.channelsCreated.length
                }`
            );

            console.log(
                `📋 Requirement channels existing: ${
                    applicationRequirementsResult.channelsExisting.length
                }`
            );

            console.log(
                `📋 Requirement channels moved: ${
                    applicationRequirementsResult.channelsMoved.length
                }`
            );

        } catch (error) {

            console.error(
                "❌ Application Requirements setup failed:",
                error
            );

            applicationRequirementsResult.errors.push({
                type: "application-requirements",
                error: error.message
            });
        }


        /*
         * ========================================================
         * STEP 3 — TICKET SYSTEM
         * ========================================================
         */

        try {

            ticketResult =
                await setupTicketSystem(guild);

            console.log(
                "✅ TruckWorks ticket system configured."
            );

        } catch (error) {

            console.error(
                "❌ Ticket system setup failed:",
                error
            );

            ticketResult = {
                success: false,
                error: error.message
            };
        }


        /*
         * ========================================================
         * STEP 4 — EMBED TEMPLATES
         * ========================================================
         */

        try {

            embedResults =
                await deployAllEmbedTemplates(guild);

            console.log(
                "✅ TruckWorks embed templates deployed."
            );

        } catch (error) {

            console.error(
                "❌ Embed deployment failed:",
                error
            );
        }


        /*
         * ========================================================
         * STEP 5 — SUPPORT CENTER
         * ========================================================
         */

        try {

            const supportChannel =
                findSupportCenterChannel(guild);

            if (supportChannel) {

                await sendTruckWorksSupportCenter(
                    supportChannel
                );

                supportCenterResult = true;

            } else {

                console.warn(
                    "⚠️ Support Center channel was not found."
                );
            }

        } catch (error) {

            console.error(
                "❌ Support Center setup failed:",
                error
            );
        }


        /*
         * ========================================================
         * STEP 6 — STAFF APPLICATION REVIEW CHANNEL
         * ========================================================
         */

        try {

            await ensureReviewChannel(guild);

            reviewChannelResult = true;

            console.log(
                "✅ Staff application review channel configured."
            );

        } catch (error) {

            console.error(
                "❌ Staff review channel setup failed:",
                error
            );
        }


        /*
         * ========================================================
         * STEP 7 — STAFF APPLICATION PANEL
         * ========================================================
         */

        try {

            await sendApplicationPanel(guild);

            staffApplicationResult = true;

            console.log(
                "✅ Staff application panel deployed."
            );

        } catch (error) {

            console.error(
                "❌ Staff application panel setup failed:",
                error
            );
        }


        /*
         * ========================================================
         * EMBED STATISTICS
         * ========================================================
         */

        const embedCreated =
            embedResults.filter(
                result =>
                    result.status === "created"
            ).length;

        const embedUpdated =
            embedResults.filter(
                result =>
                    result.status === "updated"
            ).length;

        const embedMissing =
            embedResults.filter(
                result =>
                    result.status === "missing"
            ).length;

        const embedErrors =
            embedResults.filter(
                result =>
                    result.status === "error"
            ).length;


        /*
         * ========================================================
         * APPLICATION REQUIREMENTS STATISTICS
         * ========================================================
         */

        const requirementChannelsCreated =
            applicationRequirementsResult
                .channelsCreated
                ?.length || 0;

        const requirementChannelsExisting =
            applicationRequirementsResult
                .channelsExisting
                ?.length || 0;

        const requirementChannelsMoved =
            applicationRequirementsResult
                .channelsMoved
                ?.length || 0;

        const requirementErrors =
            applicationRequirementsResult
                .errors
                ?.length || 0;


        /*
         * ========================================================
         * FINAL SETUP EMBED
         * ========================================================
         */

        const setupEmbed =
            new EmbedBuilder()
                .setTitle(
                    "🚛 TruckWorks Setup Complete"
                )

                .setDescription(
                    "The TruckWorks Discord setup process has finished."
                )

                .addFields(

                    /*
                     * SERVER STRUCTURE
                     */

                    {
                        name: "📁 Categories",
                        value:
                            `Created: **${structureResults.categoriesCreated}**\n` +
                            `Existing: **${structureResults.categoriesExisting}**`,
                        inline: true
                    },

                    /*
                     * SERVER CHANNELS
                     */

                    {
                        name: "📝 Channels",
                        value:
                            `Created: **${structureResults.channelsCreated}**\n` +
                            `Existing: **${structureResults.channelsExisting}**\n` +
                            `Moved: **${structureResults.channelsMoved}**`,
                        inline: true
                    },

                    /*
                     * EMBEDS
                     */

                    {
                        name: "📌 Embed Templates",
                        value:
                            `Created: **${embedCreated}**\n` +
                            `Updated: **${embedUpdated}**\n` +
                            `Missing: **${embedMissing}**\n` +
                            `Errors: **${embedErrors}**`,
                        inline: true
                    },

                    /*
                     * APPLICATION REQUIREMENTS
                     */

                    {
                        name: "📋 Application Requirements",
                        value:
                            `Category: **${
                                applicationRequirementsResult.categoryCreated
                                    ? "Created"
                                    : "Existing"
                            }**\n` +
                            `Created: **${requirementChannelsCreated}**\n` +
                            `Existing: **${requirementChannelsExisting}**\n` +
                            `Moved: **${requirementChannelsMoved}**\n` +
                            `Errors: **${requirementErrors}**`,
                        inline: false
                    },

                    /*
                     * TICKET SYSTEM
                     */

                    {
                        name: "🎫 Ticket System",
                        value:
                            ticketResult?.success === false
                                ? `⚠️ ${ticketResult.error}`
                                : "✅ Configured",
                        inline: true
                    },

                    /*
                     * SUPPORT CENTER
                     */

                    {
                        name: "🎫 Support Center",
                        value:
                            supportCenterResult
                                ? "✅ Deployed"
                                : "⚠️ Channel not found",
                        inline: true
                    },

                    /*
                     * STAFF APPLICATION
                     */

                    {
                        name: "🛠️ Staff Applications",
                        value:
                            staffApplicationResult
                                ? "✅ Application panel deployed"
                                : "⚠️ Application panel failed",
                        inline: true
                    },

                    /*
                     * APPLICATION REVIEW
                     */

                    {
                        name: "🔒 Application Review",
                        value:
                            reviewChannelResult
                                ? "✅ Private review channel ready"
                                : "⚠️ Review channel failed",
                        inline: true
                    },

                    /*
                     * TRUCKWORKS SYSTEMS
                     */

                    {
                        name: "🚛 TruckWorks Systems",
                        value:
                            "✅ Community & Events\n" +
                            "✅ Creator Center\n" +
                            "✅ VTC Center\n" +
                            "✅ Mod Center\n" +
                            "✅ TruckWorks Information\n" +
                            "✅ Server Network\n" +
                            "✅ Welcome System\n" +
                            "✅ Application Requirements\n" +
                            "✅ Ticket System\n" +
                            "✅ Staff Applications\n" +
                            "✅ Embed Template System",
                        inline: false
                    }
                )

                .setFooter({
                    text:
                        "TruckWorks • Server Setup"
                })

                .setTimestamp();


        /*
         * ========================================================
         * WARNINGS
         * ========================================================
         */

        if (
            structureResults.errors.length > 0 ||
            embedErrors > 0 ||
            requirementErrors > 0 ||
            ticketResult?.success === false ||
            !supportCenterResult ||
            !staffApplicationResult ||
            !reviewChannelResult
        ) {

            setupEmbed.setDescription(
                "⚠️ **TruckWorks setup completed with some warnings.**\n\n" +
                "Most systems were configured successfully, but one or more systems require attention. Check the bot console for detailed information."
            );

        } else {

            setupEmbed.setDescription(
                "✅ **TruckWorks setup completed successfully.**\n\n" +
                "Your server structure, application requirements, embed templates, ticket system, Support Center, and staff application system are ready."
            );
        }


        /*
         * ========================================================
         * SEND RESULT
         * ========================================================
         */

        await interaction.editReply({
            embeds: [setupEmbed]
        });


        /*
         * ========================================================
         * CONSOLE COMPLETION
         * ========================================================
         */

        console.log(
            "=================================================="
        );

        console.log(
            "🚛 TRUCKWORKS FULL SETUP COMPLETE"
        );

        console.log(
            "=================================================="
        );
    }
};