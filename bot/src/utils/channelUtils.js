/*
 * ============================================================
 * 🚛 BC TRUCKING WORKS
 * CHANNEL UTILITY FUNCTIONS
 * ============================================================
 */

function normalizeChannelName(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
}

function findChannel(guild, names) {
    if (!guild || !Array.isArray(names)) {
        return null;
    }

    return guild.channels.cache.find(channel => {
        if (!channel || !channel.name) {
            return false;
        }

        const channelName =
            normalizeChannelName(channel.name);

        return names.some(name => {
            const normalized =
                normalizeChannelName(name);

            return (
                channelName === normalized ||
                channelName.endsWith(normalized) ||
                normalized.endsWith(channelName)
            );
        });
    }) || null;
}

module.exports = {
    normalizeChannelName,
    findChannel
};
