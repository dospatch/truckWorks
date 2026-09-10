const { EmbedBuilder } = require("discord.js");

const FOOTER = "TruckWorks • Community & Support";

function makeEmbed({
    title,
    description,
    emoji,
    color = 0x5865F2,
    fields = []
}) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${emoji || ""} ${title}`.trim())
        .setDescription(description)
        .setFooter({
            text: FOOTER
        })
        .setTimestamp();

    if (fields.length) {
        embed.addFields(fields);
    }

    return embed;
}

const templates = {

    "changelog": () =>
        makeEmbed({
            emoji: "📋",
            title: "BC TruckWorks Changelog",
            description:
                "Official BC TruckWorks updates, fixes, improvements, and announcements are posted here.\n\n" +
                "The changelog is automatically updated when new project changes are released."
        }),


    /* =====================================================
       🎫 COMMUNITY & EVENTS
    ===================================================== */

    "convoy-planning": () =>
        makeEmbed({
            emoji: "🚛",
            title: "Convoy Planning Center",
            description:
                "Planning a TruckWorks convoy?\n\n" +
                "Use this channel to organize upcoming convoys, coordinate routes, and keep participants informed.\n\n" +
                "**Please include:**\n" +
                "• Convoy name\n" +
                "• Date and time\n" +
                "• Game — ATS or ETS2\n" +
                "• Starting location\n" +
                "• Destination\n" +
                "• Route information\n" +
                "• Required DLC or mods\n" +
                "• Any special instructions"
        }),

    "event-signups": () =>
        makeEmbed({
            emoji: "📝",
            title: "Event Sign-Ups",
            description:
                "Want to participate in a TruckWorks event?\n\n" +
                "Use the appropriate sign-up system or follow the instructions provided in the event announcement.\n\n" +
                "**Before signing up:**\n" +
                "• Read the event information\n" +
                "• Confirm the date and time\n" +
                "• Confirm the correct game\n" +
                "• Make sure you can attend\n\n" +
                "Please do not sign up if you are unsure that you can participate."
        }),

    "events": () =>
        makeEmbed({
            emoji: "📅",
            title: "TruckWorks Events",
            description:
                "Welcome to the TruckWorks Events Center.\n\n" +
                "This channel contains official TruckWorks events, community activities, convoys, game nights, and special events.\n\n" +
                "**Keep an eye on this channel for:**\n" +
                "• Upcoming events\n" +
                "• Event announcements\n" +
                "• Schedule changes\n" +
                "• Cancellations\n" +
                "• Special community activities"
        }),

    "event-applications": () =>
        makeEmbed({
            emoji: "📋",
            title: "Event Applications",
            description:
                "Interested in helping organize or host a TruckWorks event?\n\n" +
                "Submit your event application with as much information as possible.\n\n" +
                "**Applications should include:**\n" +
                "• Event name\n" +
                "• Event type\n" +
                "• Game\n" +
                "• Proposed date and time\n" +
                "• Expected attendance\n" +
                "• Route or activity details\n" +
                "• Staff requirements\n" +
                "• Additional information"
        }),

    "showcase": () =>
        makeEmbed({
            emoji: "⭐",
            title: "Community Showcase",
            description:
                "Show off your best TruckWorks content!\n\n" +
                "Share your trucking photos, videos, screenshots, builds, convoys, artwork, and other community creations.\n\n" +
                "**Please keep submissions:**\n" +
                "• Appropriate for the community\n" +
                "• Related to trucking or TruckWorks\n" +
                "• Respectful toward other members\n" +
                "• Free from spam"
        }),

    /* =====================================================
       🎨 CREATORS
    ===================================================== */

    "creator-ideas": () =>
        makeEmbed({
            emoji: "💡",
            title: "Creator Ideas",
            description:
                "Have an idea for TruckWorks creators?\n\n" +
                "Use this channel to suggest content ideas, creator events, collaborations, videos, streams, and other creative projects.\n\n" +
                "Explain your idea clearly and include any information that would help the team understand your proposal."
        }),

    "creator-showcase": () =>
        makeEmbed({
            emoji: "🎨",
            title: "Creator Showcase",
            description:
                "This is the place for TruckWorks creators to showcase their work.\n\n" +
                "Share your videos, streams, artwork, screenshots, photography, projects, and other approved content.\n\n" +
                "Please avoid excessive self-promotion and follow the TruckWorks community rules."
        }),

    /* =====================================================
       🤝 VTC
    ===================================================== */

    "vtc-partnerships": () =>
        makeEmbed({
            emoji: "🤝",
            title: "VTC Partnerships",
            description:
                "Welcome to the TruckWorks VTC Partnership Center.\n\n" +
                "VTCs interested in partnering with TruckWorks can submit partnership requests here.\n\n" +
                "**Please provide:**\n" +
                "• VTC name\n" +
                "• Discord invite\n" +
                "• Website or social links\n" +
                "• VTC description\n" +
                "• Member count\n" +
                "• Partnership proposal\n" +
                "• Primary contact"
        }),

    "vtc-recruitment": () =>
        makeEmbed({
            emoji: "🚛",
            title: "VTC Recruitment",
            description:
                "Looking for a VTC to join?\n\n" +
                "Approved VTCs may use this area to advertise recruitment opportunities.\n\n" +
                "**Recruitment posts should include:**\n" +
                "• VTC name\n" +
                "• Requirements\n" +
                "• Minimum age, if applicable\n" +
                "• Games supported\n" +
                "• Activities offered\n" +
                "• Recruitment contact\n" +
                "• Discord or application link"
        }),

    "vtc-advertisements": () =>
        makeEmbed({
            emoji: "📢",
            title: "VTC Advertisements",
            description:
                "Approved VTCs can advertise their organization and upcoming activities here.\n\n" +
                "Advertising must remain relevant, professional, and within TruckWorks guidelines.\n\n" +
                "Spam, repeated advertisements, misleading information, or unauthorized promotions may be removed."
        }),

    /* =====================================================
       🛠️ MODS
    ===================================================== */

    "mod-upload": () =>
        makeEmbed({
            emoji: "📤",
            title: "Mod Upload Center",
            description:
                "Use this area for approved TruckWorks mod uploads.\n\n" +
                "**Before uploading:**\n" +
                "• Make sure you have permission to distribute the mod\n" +
                "• Include the supported game\n" +
                "• Include the mod version\n" +
                "• Include installation instructions\n" +
                "• Include known requirements\n" +
                "• Scan files before submission"
        }),

    "mod-submission": () =>
        makeEmbed({
            emoji: "📦",
            title: "Mod Submission Center",
            description:
                "Have a mod you would like TruckWorks to review?\n\n" +
                "Submit the mod using the approved submission process.\n\n" +
                "**Include:**\n" +
                "• Mod name\n" +
                "• Author/creator\n" +
                "• Game\n" +
                "• Version\n" +
                "• Description\n" +
                "• Download or submission file\n" +
                "• Dependencies\n" +
                "• Known issues"
        }),

    "mod-bug-support": () =>
        makeEmbed({
            emoji: "🐛",
            title: "Mod Bug Support",
            description:
                "Found a problem with a TruckWorks-supported mod?\n\n" +
                "Report the issue with enough information for the team to reproduce and investigate it.\n\n" +
                "**Please include:**\n" +
                "• Mod name and version\n" +
                "• Game and game version\n" +
                "• What happened\n" +
                "• What you expected\n" +
                "• Steps to reproduce\n" +
                "• Screenshots or logs when available"
        }),

    "mod-ideas": () =>
        makeEmbed({
            emoji: "💡",
            title: "Mod Ideas",
            description:
                "Have an idea for a future TruckWorks mod?\n\n" +
                "Share your concept and explain what you would like to see.\n\n" +
                "Useful suggestions include new vehicles, trailers, accessories, features, maps, gameplay systems, and quality-of-life improvements."
        }),

    "mod-testing": () =>
        makeEmbed({
            emoji: "🧪",
            title: "Mod Testing Center",
            description:
                "This area is used for approved TruckWorks mod testing.\n\n" +
                "Testers should provide accurate feedback about performance, compatibility, bugs, visuals, gameplay, and overall functionality.\n\n" +
                "Testing information should remain organized so developers can act on the feedback."
        }),

    "mod-changelogs": () =>
        makeEmbed({
            emoji: "📋",
            title: "Mod Changelogs",
            description:
                "Official TruckWorks mod updates and changelogs are posted here.\n\n" +
                "**Changelogs may include:**\n" +
                "• New features\n" +
                "• Bug fixes\n" +
                "• Improvements\n" +
                "• Removed features\n" +
                "• Compatibility updates\n" +
                "• Version information"
        }),

    /* =====================================================
       📚 TRUCKWORKS INFORMATION
    ===================================================== */

    "truckworks-guide": () =>
        makeEmbed({
            emoji: "📚",
            title: "TruckWorks Guide",
            description:
                "Welcome to the official TruckWorks Guide.\n\n" +
                "This area provides important information to help members understand the TruckWorks community, services, servers, events, mods, and available features.\n\n" +
                "Please review the available guides before requesting assistance."
        }),

    "getting-started": () =>
        makeEmbed({
            emoji: "🚀",
            title: "Getting Started",
            description:
                "New to TruckWorks? Start here!\n\n" +
                "**Getting started:**\n" +
                "1️⃣ Read the server rules\n" +
                "2️⃣ Choose your game\n" +
                "3️⃣ Select your roles\n" +
                "4️⃣ Review the TruckWorks guide\n" +
                "5️⃣ Explore the server network\n" +
                "6️⃣ Join the community\n" +
                "7️⃣ Start trucking!"
        }),

    "choose-your-game": () =>
        makeEmbed({
            emoji: "🎮",
            title: "Choose Your Game",
            description:
                "Select the game you primarily play so you can receive the appropriate TruckWorks information and notifications.\n\n" +
                "Available games include:\n\n" +
                "🇺🇸 **American Truck Simulator (ATS)**\n" +
                "🇪🇺 **Euro Truck Simulator 2 (ETS2)**"
        }),

    "choose-your-roles": () =>
        makeEmbed({
            emoji: "🎭",
            title: "Choose Your Roles",
            description:
                "Choose the TruckWorks notification and community roles that apply to you.\n\n" +
                "Available roles may include:\n\n" +
                "🚛 Trucking\n" +
                "🎮 ATS\n" +
                "🎮 ETS2\n" +
                "📅 Events\n" +
                "🚛 Convoys\n" +
                "🎨 Creators\n" +
                "🤝 VTC\n" +
                "🛠️ Mods\n\n" +
                "Only select roles that are relevant to you."
        }),

    /* =====================================================
       🖥️ SERVER NETWORK
    ===================================================== */

    "server-status": () =>
        makeEmbed({
            emoji: "🟢",
            title: "Server Status",
            description:
                "View the current status of TruckWorks servers and services.\n\n" +
                "Server information may include:\n" +
                "🟢 Online\n" +
                "🟡 Maintenance\n" +
                "🔴 Offline\n" +
                "⚠️ Partial outage\n\n" +
                "If a server appears unavailable, check the appropriate support channel for updates."
        }),

    "server-events": () =>
        makeEmbed({
            emoji: "📅",
            title: "Server Events",
            description:
                "Official server events and scheduled activities are listed here.\n\n" +
                "Check this channel for event times, server information, requirements, and updates."
        }),

    "server-support": () =>
        makeEmbed({
            emoji: "🛠️",
            title: "Server Support",
            description:
                "Need help with a TruckWorks server?\n\n" +
                "Use the appropriate support system and provide as much information as possible.\n\n" +
                "**Helpful information:**\n" +
                "• Server name\n" +
                "• Game\n" +
                "• Issue description\n" +
                "• Error messages\n" +
                "• Screenshots\n" +
                "• Steps that caused the issue"
        }),

    "server-applications": () =>
        makeEmbed({
            emoji: "📝",
            title: "Server Applications",
            description:
                "Applications for approved TruckWorks server opportunities are handled here.\n\n" +
                "Read the application requirements carefully before submitting.\n\n" +
                "Incomplete, dishonest, or spam applications may be rejected."
        }),

    "ets2-servers": () =>
        makeEmbed({
            emoji: "🇪🇺",
            title: "ETS2 Servers",
            description:
                "Welcome to the TruckWorks Euro Truck Simulator 2 server center.\n\n" +
                "Server listings, information, events, and updates for ETS2 can be posted here."
        }),

    "ats-servers": () =>
        makeEmbed({
            emoji: "🇺🇸",
            title: "ATS Servers",
            description:
                "Welcome to the TruckWorks American Truck Simulator server center.\n\n" +
                "Server listings, information, events, and updates for ATS can be posted here."
        }),

    "server-listings": () =>
        makeEmbed({
            emoji: "🖥️",
            title: "Server Listings",
            description:
                "Browse approved TruckWorks server listings.\n\n" +
                "Server listings should provide accurate information about the server, supported game, connection details, rules, and available features."
        }),

    /* =====================================================
       👋 WELCOME
    ===================================================== */

    "welcome": () =>
        makeEmbed({
            emoji: "👋",
            title: "Welcome to TruckWorks!",
            description:
                "Welcome to the **TruckWorks community!** 🚛\n\n" +
                "We're glad to have you here.\n\n" +
                "**Getting started:**\n" +
                "📜 Read the server rules\n" +
                "🚀 Visit the Getting Started channel\n" +
                "🎮 Choose your game\n" +
                "🎭 Choose your roles\n" +
                "📚 Review the TruckWorks Guide\n" +
                "🚛 Explore our servers and events\n\n" +
                "If you need assistance, visit the **TruckWorks Support Center**.\n\n" +
                "Enjoy the community and happy trucking! 🚛"
        })
};

const channelTemplates = {
    "convoy-planning": "convoy-planning",
    "event-signups": "event-signups",
    "events": "events",
    "event-applications": "event-applications",
    "showcase": "showcase",

    "creator-ideas": "creator-ideas",
    "creator-showcase": "creator-showcase",

    "vtc-partnerships": "vtc-partnerships",
    "vtc-recruitment": "vtc-recruitment",
    "vtc-advertisements": "vtc-advertisements",

    "mod-upload": "mod-upload",
    "mod-submission": "mod-submission",
    "mod-bug-support": "mod-bug-support",
    "mod-ideas": "mod-ideas",
    "mod-testing": "mod-testing",
    "mod-changelogs": "mod-changelogs",
    "changelog": "changelog",

    "truckworks-guide": "truckworks-guide",
    "getting-started": "getting-started",
    "choose-your-game": "choose-your-game",
    "choose-your-roles": "choose-your-roles",

    "server-status": "server-status",
    "server-events": "server-events",
    "server-support": "server-support",
    "server-applications": "server-applications",
    "ets2-servers": "ets2-servers",
    "ats-servers": "ats-servers",
    "server-listings": "server-listings",
    "server-advertisement": "server-advertisement",

    "welcome": "welcome"
};

function getTemplate(channelName) {
    const key = channelTemplates[channelName];

    if (!key || !templates[key]) {
        return null;
    }

    return templates[key]();
}

function getTemplateNames() {
    return Object.keys(channelTemplates);
}

module.exports = {
    templates,
    channelTemplates,
    getTemplate,
    getTemplateNames
};
