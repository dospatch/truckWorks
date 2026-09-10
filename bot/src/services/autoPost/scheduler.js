const { postServerAd } = require("./serverAd");

let serverAdTimer = null;

function startAutoPostScheduler(client) {
    const enabled =
        String(process.env.SERVER_AD_ENABLED || "false").toLowerCase() === "true";

    if (!enabled) {
        console.log("[AUTOPOST] Automatic server advertisements are disabled.");
        return;
    }

    const channelId = process.env.SERVER_AD_CHANNEL_ID;

    if (!channelId) {
        console.log("[AUTOPOST] Automatic server advertisements are enabled, but no channel is configured.");
        return;
    }

    const intervalHours =
        Number(process.env.SERVER_AD_INTERVAL_HOURS) || 24;

    const intervalMs = intervalHours * 60 * 60 * 1000;

    console.log(
        `[AUTOPOST] Server advertisements enabled — every ${intervalHours} hour(s).`
    );

    postServerAd(client).catch(error => {
        console.error("[AUTOPOST] Initial server advertisement failed:", error);
    });

    serverAdTimer = setInterval(() => {
        postServerAd(client).catch(error => {
            console.error("[AUTOPOST] Scheduled server advertisement failed:", error);
        });
    }, intervalMs);
}

function stopAutoPostScheduler() {
    if (serverAdTimer) {
        clearInterval(serverAdTimer);
        serverAdTimer = null;
    }
}

module.exports = {
    startAutoPostScheduler,
    stopAutoPostScheduler
};
