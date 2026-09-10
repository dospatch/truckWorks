module.exports = [
    {
        id: 1,
        question: "What is your Discord username?",
        type: "short",
        required: true
    },
    {
        id: 2,
        question: "Why do you want to join the TruckWorks Event Team?",
        type: "long",
        required: true
    },
    {
        id: 3,
        question: "What types of events would you like to organize?",
        type: "long",
        required: true
    },
    {
        id: 4,
        question: "Describe an event you would like TruckWorks to host.",
        type: "long",
        required: true
    },
    {
        id: 5,
        question: "How would you advertise and promote an event?",
        type: "long",
        required: true
    },
    {
        id: 6,
        question: "How would you handle an event participant causing problems?",
        type: "long",
        required: true
    },
    {
        id: 7,
        question: "How many events could you reasonably help with each month?",
        type: "choice",
        options: [
            "1",
            "2-3",
            "4-5",
            "5+",
            "Depends on availability"
        ],
        required: true
    },
    {
        id: 8,
        question: "What is your typical availability?",
        type: "long",
        required: true
    },
    {
        id: 9,
        question: "Do you agree to follow TruckWorks event procedures?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true
    },
    {
        id: 10,
        question: "Why should TruckWorks choose you for the Event Team?",
        type: "long",
        required: true
    }
];
