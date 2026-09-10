module.exports = {
    ticketTypes: {
        general: {
            label: "General Support",
            emoji: "🎫",
            category: "SUPPORT",
            staffRole: "Support Team"
        },

        bug: {
            label: "Bug Report",
            emoji: "🐛",
            category: "SUPPORT",
            staffRole: "Developer"
        },

        member: {
            label: "Member Report",
            emoji: "👤",
            category: "SUPPORT",
            staffRole: "Moderation"
        },

        appeal: {
            label: "Appeal",
            emoji: "⚖️",
            category: "SUPPORT",
            staffRole: "Management"
        },

        server: {
            label: "Server Support",
            emoji: "🌐",
            category: "SERVER NETWORK",
            staffRole: "Server Team"
        },

        partnership: {
            label: "VTC Partnership",
            emoji: "🤝",
            category: "VTC CENTER",
            staffRole: "Partnership Team"
        },

        creator: {
            label: "Creator Support",
            emoji: "🎨",
            category: "CREATORS",
            staffRole: "Creator Team"
        }
    },

    settings: {
        maxOpenTicketsPerUser: 1,
        ticketPrefix: "ticket", 
        closedPrefix: "closed",
        deleteDelay: 5000,
        panelChannelNames: [
            "create-ticket",
            "create-tickets",
            "ticket",
            "tickets"
        ]
    }
};
