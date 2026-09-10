const { PermissionFlagsBits } = require("discord.js");

function isStaff(member) {
    return member.permissions.has(PermissionFlagsBits.ManageGuild);
}

function canModerate(member) {
    return member.permissions.has(PermissionFlagsBits.ModerateMembers);
}

function canManageMessages(member) {
    return member.permissions.has(PermissionFlagsBits.ManageMessages);
}

function canManageChannels(member) {
    return member.permissions.has(PermissionFlagsBits.ManageChannels);
}

function canManageRoles(member) {
    return member.permissions.has(PermissionFlagsBits.ManageRoles);
}

module.exports = {
    isStaff,
    canModerate,
    canManageMessages,
    canManageChannels,
    canManageRoles
};