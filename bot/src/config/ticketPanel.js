const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const ticketConfig = require("./tickets");

function createSupportCenterEmbeds() {
    return [
        new EmbedBuilder()
            .setTitle("🎫 TRUCKWORKS SUPPORT CENTER")
            .setDescription(
                "**Welcome to the official TruckWorks Support Center!**\n\n" +
                "Need assistance with something related to TruckWorks? You're in the right place.\n\n" +
                "Please use the menu below to select the **type of support you need**. " +
                "Once you select a category, a **private support ticket** will be created for you. " +
                "Only you and authorized TruckWorks staff will be able to access the ticket.\n\n" +
                "Our support team will review your request and assist you as soon as possible."
            )
            .addFields({
                name: "📌 BEFORE OPENING A TICKET",
                value:
                    "• Select the **correct ticket category**.\n" +
                    "• Provide a clear and detailed explanation.\n" +
                    "• Include screenshots, videos, links, or evidence when applicable.\n" +
                    "• Do not create multiple tickets for the same issue.\n" +
                    "• Be patient while waiting for staff.\n" +
                    "• Remain respectful and professional.\n" +
                    "• Do not repeatedly ping staff.\n" +
                    "• Do not use tickets for unrelated conversations.\n" +
                    "• Provide accurate information for reports and appeals.\n" +
                    "• False or malicious reports may result in action."
            })
            .setFooter({
                text: "TruckWorks • Professional Support System"
            }),

        new EmbedBuilder()
            .setTitle("🎫 GENERAL SUPPORT")
            .setDescription(
                "**Need help but aren't sure where your issue belongs?**\n\n" +
                "Use General Support for questions, assistance, or requests that do not fall under another category.\n\n" +
                "**Examples:**\n" +
                "• General questions\n" +
                "• Account assistance\n" +
                "• TruckWorks services\n" +
                "• Policies or procedures\n" +
                "• Finding the appropriate department\n" +
                "• Other general concerns"
            ),

        new EmbedBuilder()
            .setTitle("🐛 BUG REPORT")
            .setDescription(
                "**Found something that isn't working correctly?**\n\n" +
                "Use Bug Report for technical problems, errors, glitches, broken features, or unexpected behavior.\n\n" +
                "**Please provide:**\n" +
                "• What happened?\n" +
                "• What were you doing?\n" +
                "• What did you expect?\n" +
                "• What actually happened?\n" +
                "• Steps to reproduce the issue\n" +
                "• Screenshots or video evidence\n" +
                "• Relevant error messages\n\n" +
                "**Do not use Bug Reports for general questions or feature requests.**"
            ),

        new EmbedBuilder()
            .setTitle("👤 MEMBER REPORT")
            .setDescription(
                "**Need to report another member?**\n\n" +
                "Use Member Report when you believe a TruckWorks member has violated server rules or community guidelines.\n\n" +
                "**Please include:**\n" +
                "• Member's Discord username\n" +
                "• What happened\n" +
                "• Date/time, if known\n" +
                "• Channel/server where it occurred\n" +
                "• Screenshots, recordings, or evidence\n" +
                "• Additional information that may help\n\n" +
                "**Do not confront, threaten, or harass the member.**\n\n" +
                "Reports are handled privately by the appropriate staff team."
            ),

        new EmbedBuilder()
            .setTitle("⚖️ APPEAL")
            .setDescription(
                "**Believe a moderation action was incorrect or deserves another review?**\n\n" +
                "Use Appeal to request a review of a moderation action.\n\n" +
                "**Appeals may include:**\n" +
                "• Warnings\n" +
                "• Mutes\n" +
                "• Kicks\n" +
                "• Suspensions\n" +
                "• Bans\n" +
                "• Other moderation actions\n\n" +
                "**Please explain:**\n" +
                "• What action was taken\n" +
                "• Why it should be reconsidered\n" +
                "• Relevant circumstances\n" +
                "• Supporting evidence\n\n" +
                "Be honest and respectful. Repeated appeals for the same decision may be closed."
            ),

        new EmbedBuilder()
            .setTitle("🌐 SERVER SUPPORT")
            .setDescription(
                "**Having an issue with a TruckWorks server or service?**\n\n" +
                "Use Server Support for server-related assistance.\n\n" +
                "**Examples:**\n" +
                "• Server connection problems\n" +
                "• Server-related errors\n" +
                "• Gameplay/server issues\n" +
                "• Account or access problems\n" +
                "• Server features not working\n" +
                "• Whitelist/access questions\n" +
                "• Other server assistance\n\n" +
                "Please provide the server name and as much information as possible."
            ),

        new EmbedBuilder()
            .setTitle("🤝 VTC PARTNERSHIP")
            .setDescription(
                "**Interested in partnering with TruckWorks?**\n\n" +
                "Use VTC Partnership if you represent a Virtual Trucking Company or organization interested in working with TruckWorks.\n\n" +
                "**Partnership requests may include:**\n" +
                "• VTC partnerships\n" +
                "• Community collaborations\n" +
                "• Convoy partnerships\n" +
                "• Promotional collaborations\n" +
                "• Events\n" +
                "• Cross-community opportunities\n" +
                "• Other business/community partnerships\n\n" +
                "Please provide information about your organization and the partnership you are interested in."
            ),

        new EmbedBuilder()
            .setTitle("🎨 CREATOR SUPPORT")
            .setDescription(
                "**Are you a content creator looking to work with TruckWorks?**\n\n" +
                "Use Creator Support for creator-related questions, collaborations, promotions, or assistance.\n\n" +
                "**This category may be used for:**\n" +
                "• YouTube creators\n" +
                "• Twitch streamers\n" +
                "• TikTok creators\n" +
                "• Social media creators\n" +
                "• Trucking content creators\n" +
                "• Promotional opportunities\n" +
                "• Creator partnerships\n" +
                "• Media-related questions\n\n" +
                "Please include your platform, username/channel, and what you are looking for."
            ),

        new EmbedBuilder()
            .setTitle("🛠️ WHAT HAPPENS AFTER YOU OPEN A TICKET?")
            .setDescription(
                "**1️⃣ Submit your request**\n" +
                "Provide all relevant information and evidence.\n\n" +
                "**2️⃣ Staff review**\n" +
                "The appropriate TruckWorks team will review your ticket.\n\n" +
                "**3️⃣ Staff assistance**\n" +
                "A staff member will communicate with you and work toward resolving your issue.\n\n" +
                "**4️⃣ Resolution**\n" +
                "Once resolved, the ticket may be closed and archived.\n\n" +
                "Response times may vary depending on staff availability and request complexity."
            ),

        new EmbedBuilder()
            .setTitle("🚨 IMPORTANT")
            .setDescription(
                "**Tickets are private, but they are not a place to bypass TruckWorks rules.**\n\n" +
                "Ticket-system abuse includes:\n" +
                "❌ Spam tickets\n" +
                "❌ Duplicate tickets\n" +
                "❌ False reports\n" +
                "❌ Fake evidence\n" +
                "❌ Harassment of staff\n" +
                "❌ Unnecessary staff pinging\n" +
                "❌ Ticket manipulation\n" +
                "❌ Disruption\n\n" +
                "Abuse may result in the ticket being closed and/or additional moderation action.\n\n" +
                "If you select the wrong category, **do not create another ticket**. Let staff know and they can assist you."
            )
            .setFooter({
                text: "TruckWorks • Support Center"
            }),

        new EmbedBuilder()
            .setTitle("🎫 READY TO GET HELP?")
            .setDescription(
                "Select the option below that best matches your request.\n\n" +
                "**Please choose carefully and provide enough information for our team to properly assist you.**\n\n" +
                "Thank you for being part of the **TruckWorks community!**\n\n" +
                "**TruckWorks • Support Center**\n" +
                "*Professional Support • Community Driven • Built for Truckers*"
            )
    ];
}

function createSupportCenterMenu() {
    const options = Object.entries(ticketConfig.ticketTypes).map(
        ([value, ticket]) => ({
            label: ticket.label,
            value: `ticket:${value}`,
            description: `Open a ${ticket.label} ticket`,
            emoji: ticket.emoji
        })
    );

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("ticket_select")
            .setPlaceholder("🎫 Select a support category...")
            .addOptions(options)
    );
}

module.exports = {
    createSupportCenterEmbeds,
    createSupportCenterMenu
};
