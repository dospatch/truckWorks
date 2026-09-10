const { postServerAd } = require("./serverAd");
const {
    postConvoyUpdate,
    postVtcRecruitment,
    postMaintenanceNotice,
    postChangelogUpdate
} = require("./autoPost");

const timers = new Map();

function envTrue(name) {
    return String(process.env[name] || "false").toLowerCase() === "true";
}

function intervalMs(name, fallbackHours) {
    const hours = Number(process.env[name]) || fallbackHours;
    return Math.max(hours, 0.1) * 60 * 60 * 1000;
}

function scheduleTask(name, client, enabledEnv, intervalEnv, fallbackHours, task) {
    if (!envTrue(enabledEnv)) {
        console.log(`[AUTOPOST] ${name} is disabled.`);
        return;
    }

    const intervalHours = Number(process.env[intervalEnv]) || fallbackHours;

    console.log(
        `[AUTOPOST] ${name} enabled — every ${intervalHours} hour(s).`
    );

    task(client).catch(error => {
        console.error(`[AUTOPOST] Initial ${name} failed:`, error);
    });

    const timer = setInterval(() => {
        task(client).catch(error => {
            console.error(`[AUTOPOST] Scheduled ${name} failed:`, error);
        });
    }, intervalMs(intervalEnv, fallbackHours));

    timers.set(name, timer);
}

function startAutoPostScheduler(client) {
    stopAutoPostScheduler();

    scheduleTask(
        "Server advertisements",
        client,
        "SERVER_AD_ENABLED",
        "SERVER_AD_INTERVAL_HOURS",
        24,
        postServerAd
    );

    scheduleTask(
        "Convoy announcements",
        client,
        "CONVOY_AUTOPOST_ENABLED",
        "CONVOY_AUTOPOST_INTERVAL_HOURS",
        12,
        postConvoyUpdate
    );

    scheduleTask(
        "VTC recruitment",
        client,
        "VTC_AUTOPOST_ENABLED",
        "VTC_AUTOPOST_INTERVAL_HOURS",
        168,
        postVtcRecruitment
    );

    scheduleTask(
        "Changelog updates",
        client,
        "CHANGELOG_AUTOPOST_ENABLED",
        "CHANGELOG_AUTOPOST_INTERVAL_HOURS",
        24,
        postChangelogUpdate
    );

    scheduleTask(
        "Maintenance notices",
        client,
        "MAINTENANCE_AUTOPOST_ENABLED",
        "MAINTENANCE_AUTOPOST_INTERVAL_HOURS",
        168,
        postMaintenanceNotice
    );
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
