module.exports = [
    {
        id: 1,
        question: "What is your Discord username?",
        type: "short",
        required: true
    },
    {
        id: 2,
        question: "Why do you want to become a TruckWorks Moderator?",
        type: "long",
        required: true
    },
    {
        id: 3,
        question: "Do you have previous moderation experience?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true
    },
    {
        id: 4,
        question: "If yes, explain your previous moderation experience.",
        type: "long",
        required: false
    },
    {
        id: 5,
        question: "How would you handle a member repeatedly breaking rules?",
        type: "long",
        required: true
    },
    {
        id: 6,
        question: "How would you handle two members arguing?",
        type: "long",
        required: true
    },
    {
        id: 7,
        question: "What would you do if a friend broke a rule?",
        type: "long",
        required: true
    },
    {
        id: 8,
        question: "What would you do if another moderator abused their permissions?",
        type: "long",
        required: true
    },
    {
        id: 9,
        question: "How important is remaining neutral when moderating?",
        type: "long",
        required: true
    },
    {
        id: 10,
        question: "Do you agree not to abuse TruckWorks moderation permissions?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true
    },
    {
        id: 11,
        question: "Do you agree to maintain staff confidentiality?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true
    },
    {
        id: 12,
        question: "Why should TruckWorks choose you as a moderator?",
        type: "long",
        required: true
    }
];
