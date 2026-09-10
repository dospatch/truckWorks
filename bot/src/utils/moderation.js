const warnings = new Map();

function addWarning(userId, moderatorId, reason) {
    if (!warnings.has(userId)) {
        warnings.set(userId, []);
    }

    const userWarnings = warnings.get(userId);

    userWarnings.push({
        moderatorId,
        reason,
        timestamp: Date.now()
    });

    return userWarnings;
}

function getWarnings(userId) {
    return warnings.get(userId) || [];
}

function clearWarnings(userId) {
    warnings.delete(userId);
}

module.exports = {
    addWarning,
    getWarnings,
    clearWarnings
};