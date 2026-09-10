module.exports = [
    {
        id: 1,
        question: "What is your Discord username?",
        type: "short",
        required: true,
        points: 0
    },
    {
        id: 2,
        question: "What name would you like TruckWorks staff to call you?",
        type: "short",
        required: true,
        points: 0
    },
    {
        id: 3,
        question: "What is your ATS/ETS2 username?",
        type: "short",
        required: true,
        points: 0
    },
    {
        id: 4,
        question: "What is your primary timezone?",
        type: "choice",
        options: [
            "EST",
            "CST",
            "MST",
            "PST",
            "Other"
        ],
        required: true,
        points: 0
    },
    {
        id: 5,
        question: "What is your age range?",
        type: "choice",
        options: [
            "Under 13",
            "13-15",
            "16-17",
            "18-20",
            "21+"
        ],
        required: true,
        points: 0
    },
    {
        id: 6,
        question: "Which staff area are you interested in?",
        type: "choice",
        options: [
            "Support",
            "Moderation",
            "Driver Management",
            "Recruitment",
            "Events",
            "Training",
            "Management",
            "Other"
        ],
        required: true,
        points: 5
    },
    {
        id: 7,
        question: "Do you have previous staff or moderation experience?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true,
        points: 5
    },
    {
        id: 8,
        question: "If yes, explain your previous staff or moderation experience.",
        type: "long",
        required: false,
        points: 5
    },
    {
        id: 9,
        question: "Do you have previous VTC or gaming community experience?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true,
        points: 5
    },
    {
        id: 10,
        question: "If yes, explain your previous VTC or gaming community experience.",
        type: "long",
        required: false,
        points: 5
    },
    {
        id: 11,
        question: "Why do you want to become a TruckWorks staff member?",
        type: "long",
        required: true,
        points: 10
    },
    {
        id: 12,
        question: "What qualities make a good staff member?",
        type: "long",
        required: true,
        points: 5
    },
    {
        id: 13,
        question: "What qualities make a good application candidate?",
        type: "long",
        required: true,
        points: 10
    },
    {
        id: 14,
        question: "What is one weakness you have, and how are you working to improve it?",
        type: "long",
        required: true,
        points: 5
    },
    {
        id: 15,
        question: "A member repeatedly breaks rules and argues after receiving a warning. What would you do?",
        type: "long",
        required: true,
        points: 10
    },
    {
        id: 16,
        question: "Two members are arguing and both claim the other person started the situation. How would you handle it?",
        type: "long",
        required: true,
        points: 10
    },
    {
        id: 17,
        question: "You notice another staff member abusing their permissions. What would you do?",
        type: "long",
        required: true,
        points: 10
    },
    {
        id: 18,
        question: "Your friend breaks a TruckWorks rule. What would you do?",
        type: "choice",
        options: [
            "Ignore it because they are my friend",
            "Handle it according to the rules",
            "Ask another staff member to handle it",
            "I am not sure"
        ],
        required: true,
        points: 5
    },
    {
        id: 19,
        question: "How active are you on Discord each week?",
        type: "choice",
        options: [
            "Less than 1 hour",
            "1-3 hours",
            "3-5 hours",
            "5-10 hours",
            "10+ hours"
        ],
        required: true,
        points: 5
    },
    {
        id: 20,
        question: "Which days are you normally available?",
        type: "multi",
        options: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],
        required: true,
        points: 0
    },
    {
        id: 21,
        question: "How many hours per week can you reasonably dedicate to TruckWorks?",
        type: "choice",
        options: [
            "1-2 hours",
            "3-5 hours",
            "6-10 hours",
            "10-15 hours",
            "15+ hours",
            "Varies"
        ],
        required: true,
        points: 5
    },
    {
        id: 22,
        question: "What would you do if you were going to be unavailable for an extended period?",
        type: "long",
        required: true,
        points: 5
    },
    {
        id: 23,
        question: "How would you handle a disagreement with another staff member?",
        type: "long",
        required: true,
        points: 5
    },
    {
        id: 24,
        question: "What would you do if you disagreed with a higher-ranking staff member's decision?",
        type: "long",
        required: true,
        points: 5
    },
    {
        id: 25,
        question: "How would you respond if a member publicly criticized a staff decision?",
        type: "long",
        required: true,
        points: 5
    },
    {
        id: 26,
        question: "Do you agree to keep confidential staff information private?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true,
        points: 5,
        automaticReviewIf: "No"
    },
    {
        id: 27,
        question: "Do you agree not to abuse TruckWorks staff permissions?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true,
        points: 5,
        automaticDenyIf: "No"
    },
    {
        id: 28,
        question: "Do you agree to follow the TruckWorks handbook and chain of command?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true,
        points: 5,
        automaticDenyIf: "No"
    },
    {
        id: 29,
        question: "Is there anything else you would like management to know?",
        type: "long",
        required: false,
        points: 0
    },
    {
        id: 30,
        question: "Why should TruckWorks choose you over another candidate?",
        type: "long",
        required: true,
        points: 5
    }
];
