const staff = require("./staff");
const driver = require("./driver");
const vtc = require("./vtc");
const event = require("./event");
const creator = require("./creator");
const moderation = require("./moderation");

const questions = {
    staff,
    driver,
    vtc,
    event,
    creator,
    moderation
};

function getApplicationQuestions(type) {
    if (!type) return null;

    return questions[
        String(type).toLowerCase()
    ] || null;
}

function getApplicationQuestionTypes() {
    return Object.keys(questions);
}

function getAllApplicationQuestions() {
    return questions;
}

module.exports = {
    questions,
    getApplicationQuestions,
    getApplicationQuestionTypes,
    getAllApplicationQuestions
};
