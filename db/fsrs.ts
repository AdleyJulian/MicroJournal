import {
  Card,
  generatorParameters,
  fsrs,
  createEmptyCard,
  State,
  Grade,
} from "ts-fsrs";
import { type JournalEntry } from "@/db/schema/schema";
import { JournalEntryContent } from "./schema/types";

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true, // Enable short-term for shorter initial intervals like Anki
  maximum_interval: 365,
  request_retention: 0.9, // Higher retention for longer intervals
  // Custom FSRS weights optimized for Anki-like intervals
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61]
});
const f = fsrs(params);

const stateMap: { [key: string]: State } = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
  "1": State.New,
  "2": State.Learning,
  "3": State.Review,
  "4": State.Relearning,
};

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
    state: "0",
    promptQuestion: data.promptQuestion,
    answer: data.answer,
    entryDate: new Date(data.entryDate), // Convert to timestamp
    articleJson: data.article,
    createdAt: new Date(),
    updatedAt: new Date(),
    cardType: "user",
    lastReview: null,
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

export const getPreview = (entry: JournalEntry, isAheadCard: boolean = false) => { // isAheadCard parameter kept for future use
  const state = stateMap[entry.state] as State;

  const card: Card = {
    due: entry.due,
    stability: entry.stability,
    difficulty: entry.difficulty,
    elapsed_days: entry.elapsedDays,
    scheduled_days: entry.scheduledDays,
    reps: entry.reps,
    lapses: entry.lapses,
    state: state as State,
    last_review: entry.lastReview === null ? undefined : entry.lastReview,
  };

  // For ahead cards, use current date for preview calculation
  const previewDate = isAheadCard ? new Date() : entry.due;
  return f.repeat(card, previewDate);
};

export const reviewEntry = async (entry: JournalEntry, grade: Grade, isAheadCard: boolean = false) => {
  if (isAheadCard) {
    // For ahead cards, we need to schedule from today, not the original due date
    const state = stateMap[entry.state] as State;

    const card: Card = {
      due: entry.due,
      stability: entry.stability,
      difficulty: entry.difficulty,
      elapsed_days: entry.elapsedDays,
      scheduled_days: entry.scheduledDays,
      reps: entry.reps,
      lapses: entry.lapses,
      state: state as State,
      last_review: entry.lastReview === null ? undefined : entry.lastReview,
    };

    // Use current date as the review time for ahead cards
    return f.repeat(card, new Date())[grade];
  } else {
    // Normal review flow
    const scheduling = getPreview(entry);
    return scheduling[grade];
  }
};
