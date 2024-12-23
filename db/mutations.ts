import { db } from "@/db/client";
import { journalEntries, type JournalEntry } from "@/db/schema/schema";
import { desc, eq } from "drizzle-orm";
import { JournalEntryContent, ArticleData } from "./schema/types";
import { newCard, type ReviewGrade, reviewEntry } from "./fsrs";

export async function newEntry(entry: JournalEntryContent) {
  const card = newCard(entry);
  console.log(card);
  const newEntry = {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: card.reps,
    lapses: card.lapses,
    state: "new",
    promptQuestion: entry.promptQuestion,
    answer: entry.answer,
    createdAt: new Date(),
    updatedAt: new Date(),
    articleJson: null,
  };

  db.insert(journalEntries).values(newEntry).run();
}

export function deleteEntry(id: number) {
  db.delete(journalEntries)
    .where(eq(journalEntries.id, Number(id)))
    .run();
}

export const updateEntry = async (entry: JournalEntry) => {
  db.update(journalEntries)
    .set(entry)
    .where(eq(journalEntries.id, entry.id))
    .run();
};

export const updateEntrywithReview = async (
  entry: JournalEntry,
  grade: ReviewGrade
) => {
  const { card, log } = await reviewEntry(entry, grade);
  const result: JournalEntry = {
    id: entry.id,
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: log.elapsed_days,
    scheduledDays: log.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state.toString(),
    updatedAt: new Date(),
    promptQuestion: entry.promptQuestion,
    answer: entry.answer,
    createdAt: entry.createdAt,
  };
  db.update(journalEntries)
    .set(result)
    .where(eq(journalEntries.id, entry.id))
    .run();
};

export const createArticleEntry = async (article: ArticleData) => {
  if (!article) {
    return;
  }

  const journalEntry = {
    promptQuestion: "📰 What important event happened today?",
    answer: article?.title || "",
    tags: [],
    articleJson: article,
  };

  // const card = newCard(journalEntry);

  // db.insert(journalEntries).values(newEntry).run();
};
