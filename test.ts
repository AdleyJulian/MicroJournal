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
    due: now,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: card.reps,
    lapses: card.lapses,
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

  // const stateMap: { [key: string]: State } = {
  //   new: State.New,
  //   learning: State.Learning,
  //   review: State.Review,
  //   relearning: State.Relearning,
  //   "1": State.New,
  //   "2": State.Learning,
  //   "3": State.Review,
  //   "4": State.Relearning,
  // };

  const stateMap: { [key in State]: string } = {
    [State.New]: "new",
    [State.Learning]: "learning",
    [State.Review]: "review",
    [State.Relearning]: "relearning",
  };

  const ratings: ReviewGrade[] = Array(10).fill(Rating.Easy);
  const intervals: number[] = [];

  console.log("Rating sequence: 3,3,3,3,3,3,3,3,3,3");
  // const due = new Date("2025-07-06T20:26:09.545Z"); // Fixed date for testing
  // const last_review = new Date("2025-06-09T20:18:16.275Z"); // Fixed date for testing
  // let testCard: Card = {
  //   due: due,
  //   stability: 4.46685806,
  //   difficulty: 5.23553542,
  //   elapsed_days: 0,
  //   scheduled_days: 6,
  //   reps: 6,
  //   lapses: 0,
  //   state: 2,
  // };
  // console.log(`First card:`, testCard);
  // const result1 = f.repeat(testCard, due)[Rating.Good];
  // console.log("Schedule Result", result1.card);
  // testCard.last_review = last_review;
  // console.log(`Second card:`, testCard);
  // const result2 = f.repeat(testCard, due)[Rating.Good];
  // console.log("Schedule Result", result2.card);

  for (const rating of ratings) {
    // 1. Perform the review at the current 'now' date.
    // For the first review, 'now' is the creation date.
    // For subsequent reviews, 'now' is the 'due' date from the previous review.
    // const scheduling = f.next(card, now, Rating.Good);
    // const scheduling = f.repeat(card, now)[rating];
    let entry: JournalEntry = {
      id: 0,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsedDays: card.elapsed_days,
      scheduledDays: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: stateMap[card.state], // Ensure state is mapped correctly
      promptQuestion: "What is the capital of France?",
      answer: "Paris",
      entryDate: now,
      articleJson: null, // Assuming no article data for this test
      createdAt: now,
      updatedAt: now,
      cardType: "user",
      lastReview: card.last_review === undefined ? null : card.last_review, // Assuming no previous review for this test
    };
    console.log(
      `Reviewing entry with state: ${card.state}, due: ${card.due}, stability: ${card.stability}, difficulty: ${card.difficulty}`
    );
    const scheduling = await reviewEntry(entry, Rating.Good);
    // const scheduling = f.next(card, card.due, Rating.Good);
    console.log(`Prior to review:`, card);
    // const scheduling = f.repeat(card, card.due)[Rating.Good];
    console.log(`Scheduling result:`, scheduling.card);

    // 2. Update the card with the new state from the review.
    card = scheduling.card;

    // // 3. Set the date for the *next* review to the new 'due' date.
    // now = card.due;

    // 4. Record the scheduled interval in days for logging.
    intervals.push(card.scheduled_days);
  }

  // Format the collected intervals into the desired string format.
  const formattedIntervals = intervals.map(formatInterval).join(",");
  console.log(`FSRS's intervals: ${formattedIntervals}`);
};

runTest();
