module.exports = [
    {
        id: 1,
        question: "What is your Discord username?",
        type: "short",
        required: true
    },
    {
        id: 2,
        question: "What is your ATS/ETS2 username?",
        type: "short",
        required: true
    },
    {
        id: 3,
        question: "Which game do you primarily play?",
        type: "choice",
        options: [
            "American Truck Simulator",
            "Euro Truck Simulator 2",
            "Both"
        ],
        required: true
    },
    {
        id: 4,
        question: "How long have you been playing truck simulators?",
        type: "long",
        required: true
    },
    {
        id: 5,
        question: "What type of trucking do you enjoy most?",
        type: "choice",
        options: [
            "Long Haul",
            "Short Haul",
            "Heavy Haul",
            "Convoys",
            "Escort",
            "All of the above"
        ],
        required: true
    },
    {
        id: 6,
        question: "How would you describe your driving style?",
        type: "long",
        required: true
    },
    {
        id: 7,
        question: "How would you handle a disagreement during a convoy?",
        type: "long",
        required: true
    },
    {
        id: 8,
        question: "Do you agree to follow TruckWorks convoy and driving rules?",
        type: "choice",
        options: [
            "Yes",
            "No"
        ],
        required: true
    },
    {
        id: 9,
        question: "How often are you available for TruckWorks events?",
        type: "choice",
        options: [
            "Rarely",
            "Sometimes",
            "Often",
            "Very Often"
        ],
        required: true
    },
    {
        id: 10,
        question: "Why would you like to become a TruckWorks driver?",
        type: "long",
        required: true
    }
];
