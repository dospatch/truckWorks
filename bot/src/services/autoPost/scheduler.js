const { postServerAd } = require("./serverAd");
const {
    postConvoyUpdate,
    postVtcRecruitment,
    postMaintenanceNotice,
    postChangelogUpdate
} = require("./autoPost");
const embedChannelConfig = require("../embedChannelConfig");

const timers = new Map();

function intervalMs(envName, fallbackHours) {
    const hours = Number(process.env[envName]);
    const safeHours = Number.isFinite(hours) && hours > 0 ? hours : fallbackHours;
    return safeHours * 60 * 60 * 1000;
}

function isConfigured(type) {
    const config = embedChannelConfig.get(type);
    return Boolean(config?.enabled && Array.isArray(config.channelIds) && config.channelIds.length);
}

function scheduleTask(name, type, client, intervalEnv, fallbackHours, task) {
    const run = async () => {
        if (!isConfigured(type)) {
            return;
        }

        try {
            const posted = await task(client);
            if (posted) {
                console.log(`[AUTOPOST] ${name} posted to ${posted} channel(s).`);
            }
        } catch (error) {
            console.error(`[AUTOPOST] ${name} failed:`, error);
        }
    };

    const intervalHours = Number(process.env[intervalEnv]);
    const safeIntervalHours = Number.isFinite(intervalHours) && intervalHours > 0
        ? intervalHours
        : fallbackHours;

    console.log(
        `[AUTOPOST] ${name} ready — configure channels with /embed-config — every ${safeIntervalHours} hour(s).`
    );

    const timer = setInterval(run, intervalMs(intervalEnv, fallbackHours));
    timers.set(name, timer);
}

function startAutoPostScheduler(client) {
    stopAutoPostScheduler();

    console.log("");
    console.log("========================================");
    console.log("       BC TRUCK WORKS AUTOPOST");
    console.log("========================================");

    scheduleTask(
        "Server advertisements",
        "server_recruitment",
        client,
        "SERVER_AD_INTERVAL_HOURS",
        24,
        postServerAd
    );

    scheduleTask(
        "Convoy announcements",
        "convoy",
        client,
        "CONVOY_AUTOPOST_INTERVAL_HOURS",
        12,
        postConvoyUpdate
    );

    scheduleTask(
        "VTC recruitment",
        "vtc_recruitment",
        client,
        "VTC_AUTOPOST_INTERVAL_HOURS",
        168,
        postVtcRecruitment
    );

    scheduleTask(
        "Changelog updates",
        "changelog",
        client,
        "CHANGELOG_AUTOPOST_INTERVAL_HOURS",
        24,
        postChangelogUpdate
    );

    scheduleTask(
        "Maintenance notices",
        "maintenance",
        client,
        "MAINTENANCE_AUTOPOST_INTERVAL_HOURS",
        168,
        postMaintenanceNotice
    );

    console.log("========================================");
    console.log("");
}

function stopAutoPostScheduler() {
    for (const timer of timers.values()) {
        clearInterval(timer);
    }

    timers.clear();
}

module.exports = {
    startAutoPostScheduler,
    stopAutoPostScheduler
};
