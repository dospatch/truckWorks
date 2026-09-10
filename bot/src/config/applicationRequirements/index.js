const staff = require("./staff");
const driver = require("./driver");
const vtc = require("./vtc");
const event = require("./event");
const creator = require("./creator");
const moderation = require("./moderation");

const questions = require("./questions");

const requirements = {
    staff,
    driver,
    vtc,
    event,
    creator,
    moderation
};

function getApplicationRequirements(type) {
    if (!type) return null;

    return requirements[
        String(type).toLowerCase()
    ] || null;
}

function getApplicationTypes() {
    return Object.keys(requirements);
}

function getAllApplicationRequirements() {
    return requirements;
}

module.exports = {
    requirements,
    questions,

    getApplicationRequirements,
    getApplicationTypes,
    getAllApplicationRequirements,

    getApplicationQuestions:
        questions.getApplicationQuestions,

    getApplicationQuestionTypes:
        questions.getApplicationQuestionTypes,

    getAllApplicationQuestions:
        questions.getAllApplicationQuestions
};
