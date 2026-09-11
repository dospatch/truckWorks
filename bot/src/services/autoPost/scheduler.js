const fs = require("fs");
const path = require("path");

const { postServerAd } = require("./serverAd");

const {
    postConvoyUpdate,
    postVtcRecruitment,
    postMaintenanceNotice,
    postChangelogUpdate
} = require("./autoPost");

const timers = new Map();

const STATE_PATH = path.join(
    __dirname,
    "../../../../data/autopost-state.json"
);

function loadState() {
    try {
        if (!fs.existsSync(STATE_PATH)) {
            return {};
        }

        const raw = fs.readFileSync(STATE_PATH, "utf8");

        if (!raw.trim()) {
            return {};
        }

        const parsed = JSON.parse(raw);

        return parsed && typeof parsed === "object"
            ? parsed
            : {};
    } catch (error) {
        console.error(
            "[AUTOPOST] Failed to load persistent state:",
            error
        );

        return {};
    }
}

function saveState(state) {
    try {
        fs.mkdirSync(
            path.dirname(STATE_PATH),
            { recursive: true }
        );

        fs.writeFileSync(
            STATE_PATH,
            JSON.stringify(state, null, 2),
            "utf8"
        );
    } catch (error) {
        console.error(
            "[AUTOPOST] Failed to save persistent state:",
            error
        );
    }
}

const state = loadState();

function getIntervalHours(envName, fallback) {
    const value = Number(process.env[envName]);

    if (!Number.isFinite(value) || value <= 0) {
        return fallback;
    }

    return value;
}

function getChannelIds(envName) {
    return String(process.env[envName] || "")
        .split(",")
        .map(id => id.trim())
        .filter(Boolean);
}

function hasChannels(envName) {
    return getChannelIds(envName).length > 0;
}

function canPost(name, intervalHours) {
    const lastPosted = Number(state[name] || 0);

    if (!lastPosted) {
        return true;
    }

    const elapsed = Date.now() - lastPosted;
    const intervalMs = intervalHours * 60 * 60 * 1000;

    return elapsed >= intervalMs;
}

function timeUntilNextPost(name, intervalHours) {
    const lastPosted = Number(state[name] || 0);

    if (!lastPosted) {
        return 0;
    }

    const intervalMs =
        intervalHours * 60 * 60 * 1000;

    const remaining =
        intervalMs - (Date.now() - lastPosted);

    return Math.max(0, remaining);
}

async function runTask(
    name,
    intervalHours,
    task
) {
    if (!canPost(name, intervalHours)) {
        const remaining =
            timeUntilNextPost(
                name,
                intervalHours
            );

        const minutes =
            Math.ceil(
                remaining / 60000
            );

        console.log(
            `[AUTOPOST] ${name} skipped — next post allowed in approximately ${minutes} minute(s).`
        );

        return;
    }

    try {
        const result = await task();

        if (result === false) {
            console.log(
                `[AUTOPOST] ${name} did not post. Persistent timer was not updated.`
            );

            return;
        }

        state[name] = Date.now();

        saveState(state);

        console.log(
            `[AUTOPOST] ${name} completed and persistent timer updated.`
        );
    } catch (error) {
        console.error(
            `[AUTOPOST] ${name} failed:`,
            error
        );
    }
}

function scheduleTask(
    name,
    client,
    channelEnv,
    intervalEnv,
    fallbackHours,
    task
) {
    if (!hasChannels(channelEnv)) {
        console.log(
            `[AUTOPOST] ${name} skipped — ${channelEnv} is not configured.`
        );

        return;
    }

    const intervalHours =
        getIntervalHours(
            intervalEnv,
            fallbackHours
        );

    const channelCount =
        getChannelIds(channelEnv).length;

    console.log(
        `[AUTOPOST] ${name} active — ${channelCount} channel(s) — every ${intervalHours} hour(s).`
    );

    runTask(
        name,
        intervalHours,
        () => task(client)
    );

    const timer = setInterval(() => {
        runTask(
            name,
            intervalHours,
            () => task(client)
        );
    }, intervalHours * 60 * 60 * 1000);

    timers.set(name, timer);
}

function startAutoPostScheduler(client) {
    stopAutoPostScheduler();

    console.log("");
    console.log("========================================");
    console.log("       BC TRUCK WORKS AUTOPOST");
    console.log("========================================");

    scheduleTask(
        "Server recruitment",
        client,
        "SERVER_AD_CHANNEL_ID",
        "SERVER_AD_INTERVAL_HOURS",
        24,
        postServerAd
    );

    scheduleTask(
        "Convoy announcements",
        client,
        "CONVOY_AUTOPOST_CHANNEL_ID",
        "CONVOY_AUTOPOST_INTERVAL_HOURS",
        12,
        postConvoyUpdate
    );

    scheduleTask(
        "VTC recruitment",
        client,
        "VTC_AUTOPOST_CHANNEL_IDS",
        "VTC_AUTOPOST_INTERVAL_HOURS",
        168,
        postVtcRecruitment
    );

    scheduleTask(
        "Changelog updates",
        client,
        "CHANGELOG_AUTOPOST_CHANNEL_ID",
        "CHANGELOG_AUTOPOST_INTERVAL_HOURS",
        24,
        postChangelogUpdate
    );

    scheduleTask(
        "Maintenance notices",
        client,
        "MAINTENANCE_AUTOPOST_CHANNEL_ID",
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
