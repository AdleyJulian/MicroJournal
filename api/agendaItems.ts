type JournalEntryItem = {
  // Renaming type to be more specific
  id: number;
  promptQuestion: string;
  answer: string;
};

const agendaItems: { title: string; data: JournalEntryItem[] }[] = [
  {
    title: "2025-02-01",
    data: [
      {
        id: 1,
        promptQuestion: "What was the best part of your day?",
        answer:
          "Enjoyed a long walk in the park during sunset. The colors were incredible.",
      },
      {
        id: 2,
        promptQuestion: "What did you work on today?",
        answer:
          "Made good progress on the Explore Memories screen, especially the calendar component.",
      },
    ],
  },
  {
    title: "2025-02-02",
    data: [
      {
        id: 3,
        promptQuestion: "What interesting place did you visit today?",
        answer:
          "Explored a new coffee shop in the neighborhood, 'The Daily Grind'. Great atmosphere and coffee!",
      },
    ],
  },
  {
    title: "2025-02-05", // Example of skipping a day to show empty days
    data: [
      {
        id: 4,
        promptQuestion: "What did you read/watch today?",
        answer:
          "Finished reading 'Project Hail Mary' by Andy Weir. Highly recommend it!",
      },
      {
        id: 5,
        promptQuestion: "What was the top headline in the news?",
        answer: "Local elections saw a surprisingly high voter turnout.",
      },
    ],
  },
  {
    title: "2025-02-08",
    data: [
      {
        id: 6,
        promptQuestion: "Did you meet anyone new today?",
        answer: "Met a friendly dog owner at the park.  Her dog was adorable!",
      },
    ],
  },
  {
    title: "2025-02-11",
    data: [
      {
        id: 7,
        promptQuestion: "What did you work on?",
        answer:
          "Focused on designing the user flow for the News Tab. Still in the early stages.",
      },
    ],
  },
  {
    title: "2025-02-14",
    data: [
      {
        id: 8,
        promptQuestion: "What was the best part of your day?",
        answer:
          "Having a relaxed and productive day working on the app.  Felt a good sense of accomplishment.",
      },
      {
        id: 9,
        promptQuestion: "Happy Valentine's Day! What did you read/watch?",
        answer: "Watched 'Love Actually' - a Valentine's Day classic!",
      },
    ],
  },
];
