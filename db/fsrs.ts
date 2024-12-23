import {
  Card,
  State,
  FSRSAlgorithm,
  generatorParameters,
  fsrs,
  createEmptyCard,
  Rating,
} from "ts-fsrs";
import { type JournalEntry } from "@/db/schema/schema";
import { JournalEntryContent } from "./schema/types";

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true,
  maximum_interval: 365,
});
const f = fsrs(params);
const card: Card = createEmptyCard();

export const newCard = (data: JournalEntryContent) => {
  const card = createEmptyCard();
  const journalEntry: JournalEntry = {
    id: 0,
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: card.reps,
    lapses: card.lapses,
    state: "new",
    promptQuestion: data.promptQuestion,
    answer: data.answer,
    articleJson: data.article,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return journalEntry;
};

export const newCardWithContent = (question?: string, answer?: string) => {
  const card = createEmptyCard();
  return card;
};

export const reviewCard = (card: JournalEntryContent, grade: string) => {
  const emptyCard = createEmptyCard();

  return newCard;
};

// type ReviewGrade = "Again" | "Hard" | "Good" | "Easy";

export enum ReviewGrade {
  Again = "Again",
  Hard = "Hard",
  Good = "Good",
  Easy = "Easy",
}

interface ReviewResult {
  card: JournalEntry;
  schedulingInfo: {
    rating: number;
    ratingName: string;
    previousState: string;
    newState: string;
    previousDue: Date;
    newDue: Date;
    elapsedDays: number;
    scheduledDays: number;
    stability: number;
    difficulty: number;
    retrievability?: number;
  };
}
export const reviewEntry = async (entry: JournalEntry, grade: ReviewGrade) => {
  console.log("Reviewing entry", entry, "with grade", grade);

  const card: Card = {
    due: entry.due,
    stability: entry.stability,
    difficulty: entry.difficulty,
    elapsed_days: entry.elapsedDays,
    scheduled_days: entry.scheduledDays,
    reps: entry.reps,
    lapses: entry.lapses,
    state: entry.state as any,
  };

  // Convert grade to numerical rating for FSRS
  const rating =
    grade === "Again"
      ? Rating.Again
      : grade === "Hard"
        ? Rating.Hard
        : grade === "Good"
          ? Rating.Good
          : Rating.Easy;

  console.log("Rating:", rating);

  const now = new Date();
  const scheduling = f.next(card, now, rating);
  return scheduling;
};
