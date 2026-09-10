module.exports = [
    {
        id: 1,
        question: "What is your Discord username?",
        type: "short",
        required: true
    },
    {
        id: 2,
        question: "What is your creator name?",
        type: "short",
        required: true
    },
    {
        id: 3,
        question: "Which platforms do you create content on?",
        type: "multi",
        options: [
            "YouTube",
            "Twitch",
            "TikTok",
            "Facebook",
            "Kick",
            "Other"
        ],
        required: true
    },
    {
        id: 4,
        question: "Provide your primary creator link.",
        type: "short",
        required: true
    },
    {
        id: 5,
        question: "What type of content do you create?",
        type: "long",
        required: true
    },
    {
        id: 6,
        question: "How often do you create content?",
        type: "choice",
        options: [
            "Daily",
            "Several times a week",
            "Weekly",
            "Occasionally"
        ],
        required: true
    },
    {
        id: 7,
        question: "How would you promote TruckWorks appropriately in your content?",
        type: "long",
        required: true
    },
    {
        id: 8,
        question: "Why do you want to become a TruckWorks Creator?",
        type: "long",
        required: true
    },
    {
        id: 9,
        question: "How would you handle negative feedback about TruckWorks?",
        type: "long",
        required: true
    },
    {
        id: 10,
        question: "Do you agree to follow TruckWorks creator guidelines?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true
    }
];
