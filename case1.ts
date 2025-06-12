import {
  Card,
  generatorParameters,
  fsrs,
  createEmptyCard,
  Rating,
  State,
} from "ts-fsrs";

import { reviewEntry } from "./db/fsrs";
import { type JournalEntry } from "./db/schema/schema";
/**
 * Converts a number of days into a human-readable format (d, m, y).
 * @param days The number of days.
 * @returns A formatted string representing the interval.
 */
const formatInterval = (days: number): string => {
  if (days < 30) {
    return `${days}d`;
  }
  const months = days / 30;
  if (months < 12) {
    // Remove .0 for whole numbers
    return `${months.toFixed(1)}m`.replace(".0", "");
  }
  const years = days / 365;
  return `${years.toFixed(1)}y`.replace(".0", "");
};

const runTest = async () => {
  console.log("--- FSRS Test Scenario ---");

  // FSRS parameters. `enable_fuzz` is set to false for deterministic, testable output.
  const params = generatorParameters({
    enable_fuzz: false,
    enable_short_term: true,
  });
  const f = fsrs(params);

  // Initialize a new card. The first review will happen 'now'.
  let card: Card = createEmptyCard();
  let now = new Date();

  let entry: JournalEntry = {
    id: 0,
    due: new Date("2025-06-10T19:17:38.000Z"),
    stability: 3.173,
    difficulty: 5.28243442,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 3,
    lapses: 0,
    state: "new",
    promptQuestion: "What is the capital of France?",
    answer: "Paris",
    entryDate: now,
    articleJson: null, // Assuming no article data for this test
    createdAt: now,
    updatedAt: now,
    cardType: "user",
    lastReview: null,
  };

  enum ReviewGrade {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
  }

  const stateMap: { [key in State]: string } = {
    [State.New]: "new",
    [State.Learning]: "learning",
    [State.Review]: "review",
    [State.Relearning]: "relearning",
  };

  const ratings: ReviewGrade[] = Array(10).fill(Rating.Easy);
  const intervals: number[] = [];

  const due = new Date("2025-06-10T19:17:38.000Z"); // Fixed date for testing
  const last_review = new Date("2025-06-10T19:07:38.000Z"); // Fixed date for testing
  let testCard: Card = {
    due: due,
    stability: 3.173,
    difficulty: 5.28243442,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 3,
    lapses: 0,
    state: 1,
  };
  console.log(`First card:`, testCard);
  const result1 = f.repeat(testCard, due)[Rating.Good];
  console.log("Schedule Result", result1.card);
  testCard.last_review = last_review;
  console.log(`Second card:`, testCard);
  const result2 = f.repeat(testCard, due)[Rating.Good];
  console.log("Schedule Result", result2.card);

  // Format the collected intervals into the desired string format.
};

runTest();
