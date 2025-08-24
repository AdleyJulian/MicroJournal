import { db } from "@/db/client";
import {
  journalEntries,
  tags,
  entryTags,
  mediaAttachments,
} from "@/db/schema/schema";
import { desc, eq, lte, count, and, gte, sql } from "drizzle-orm";
import { type JournalEntry, type MediaAttachment } from "@/db/schema/schema";
import { formatDateToUTCString } from "@/lib/dateUtils";

export type AgendaItem = {
  title: string;
  data: {
    id: number;
    due: Date;
    stability: number;
    difficulty: number;
    elapsedDays: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
    state: string;
    promptQuestion: string | null;
    answer: string | null;
    articleJson: any | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    entryDate: Date;
    media_attachments: MediaAttachment | null;
  }[];
};

export const getAllEntries = async () => {
  return db
    .select()
    .from(journalEntries)
    .leftJoin(mediaAttachments, eq(journalEntries.id, mediaAttachments.entryId))
    .where(eq(journalEntries.cardType, "user"))
    .orderBy(desc(journalEntries.entryDate));
  // return await db.select().from(journalEntries);
};

export const getAllEntriesGroupedByDate = async () => {
  // First get all entries with their attachments
  const entries = await db
    .select()
    .from(journalEntries)
    .leftJoin(mediaAttachments, eq(journalEntries.id, mediaAttachments.entryId))
    .where(eq(journalEntries.cardType, "user"))
    .orderBy(desc(journalEntries.entryDate));
  const groupedEntries: { [key: string]: any[] } = {}; // Group entries by date string

  entries.forEach((entry) => {
    const { journal_cards, media_attachments } = entry;
    const { entryDate } = journal_cards;

    // Use consistent date formatting to avoid timezone issues
    const date = formatDateToUTCString(entryDate);

    // Create a new entry object
    const newEntry = {
      id: journal_cards.id,
      due: journal_cards.due,
      stability: journal_cards.stability,
      difficulty: journal_cards.difficulty,
      elapsedDays: journal_cards.elapsedDays,
      scheduledDays: journal_cards.scheduledDays,
      reps: journal_cards.reps,
      lapses: journal_cards.lapses,
      state: journal_cards.state,
      promptQuestion: journal_cards.promptQuestion,
      answer: journal_cards.answer,
      articleJson: journal_cards.articleJson,
      entryDate: journal_cards.entryDate,
      createdAt: journal_cards.createdAt,
      updatedAt: journal_cards.updatedAt,
      media_attachments: media_attachments,
    };
    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }
    groupedEntries[date].push(newEntry); // Push the whole joined entry
  });
  const agendaItems: AgendaItem[] = Object.keys(groupedEntries).map((date) => ({
    title: String(date),
    data: groupedEntries[date],
  }));

  // Sort agendaItems by title (date)

  agendaItems.sort((a, b) => {
    const dateA = a.title;
    const dateB = b.title;

    if (dateA < dateB) {
      return -1; // a comes before b
    } else if (dateA > dateB) {
      return 1; // a comes after b
    } else {
      return 0; // a and b are equal
    }
  });

  return agendaItems;
};

export const getEntryById = async (id: number) => {
  const result = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.id, id))
    .leftJoin(
      mediaAttachments,
      eq(journalEntries.id, mediaAttachments.entryId)
    );

  return result[0];
};

export const getDueEntries = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return await db
    .select()
    .from(journalEntries)
    .where(lte(journalEntries.due, tomorrow))
    .orderBy(desc(journalEntries.due));
};

export const getDueAndAheadEntries = async (daysAhead: number = 0) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of the day
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let query = db
    .select()
    .from(journalEntries)
    .where(lte(journalEntries.due, tomorrow));

  if (daysAhead > 0) {
    // For review ahead, also include cards that are scheduled for review
    // but not yet due (within the specified number of days)
    const daysFromNow = new Date(today);
    daysFromNow.setDate(daysFromNow.getDate() + daysAhead);

    query = db
      .select()
      .from(journalEntries)
      .where(
        and(
          lte(journalEntries.due, daysFromNow),
          // Only include cards that are in review state (not new/learning)
          gte(journalEntries.reps, 1)
        )
      );
  }

  return await query.orderBy(desc(journalEntries.due));
};

export async function getEntriesByTag(tagName: string) {
  const entriesWithTag = await db
    .select({
      entry: journalEntries,
      tag: tags,
    })
    .from(journalEntries)
    .innerJoin(entryTags, eq(entryTags.entryId, journalEntries.id))
    .innerJoin(tags, eq(tags.id, entryTags.tagId))
    .where(eq(tags.name, tagName));

  return entriesWithTag;
}

/**
 * Get the count of entries due for review (including new cards)
 */
export const getDueEntriesCount = async (): Promise<number> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(lte(journalEntries.due, tomorrow));

    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error getting due entries count:', error);
    return 0;
  }
};

/**
 * Get count of cards available for review at different time points
 */
export const getCardCountsByDays = async (maxDays: number = 30): Promise<{ days: number; count: number; }[]> => {
  const result: { days: number; count: number; }[] = [];

  for (let days = 0; days <= maxDays; days++) {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    targetDate.setDate(targetDate.getDate() + days);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(
        and(
          lte(journalEntries.due, nextDay),
          gte(journalEntries.reps, days === 0 ? 0 : 1) // Include new cards only for day 0
        )
      );

    result.push({
      days,
      count: count[0]?.count || 0
    });
  }

  return result;
};

/**
 * Get count of forgotten cards from the last N days
 */
export const getForgottenCardCounts = async (maxDays: number = 30): Promise<{ days: number; count: number; }[]> => {
  const result: { days: number; count: number; }[] = [];

  for (let days = 0; days <= maxDays; days++) {
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0);
    targetDate.setDate(targetDate.getDate() - days);

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(
        and(
          gte(journalEntries.lastReview, targetDate),
          gte(journalEntries.lapses, 1), // Cards that have been forgotten at least once
          eq(journalEntries.state, "3") // Currently in relearning state (forgotten)
        )
      );

    result.push({
      days,
      count: count[0]?.count || 0
    });
  }

  return result;
};

/**
 * Get total count of cards that would be included with specific review parameters
 */
export const getReviewSessionCardCount = async (daysAhead: number, forgottenDays: number): Promise<{
  totalCards: number;
  regularCards: number;
  forgottenCards: number;
}> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Regular cards (due today + ahead if specified)
  const reviewEndDate = new Date(today);
  reviewEndDate.setDate(reviewEndDate.getDate() + daysAhead + 1); // +1 to include the end date

  const regularCardsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(journalEntries)
    .where(
      and(
        lte(journalEntries.due, reviewEndDate),
        gte(journalEntries.reps, daysAhead === 0 ? 0 : 1)
      )
    );

  // Forgotten cards (from the last forgottenDays)
  const forgottenStartDate = new Date(today);
  forgottenStartDate.setDate(forgottenStartDate.getDate() - forgottenDays);

  const forgottenCardsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(journalEntries)
    .where(
      and(
        gte(journalEntries.lastReview, forgottenStartDate),
        gte(journalEntries.lapses, 1),
        eq(journalEntries.state, "3")
      )
    );

  const regularCards = regularCardsResult[0]?.count || 0;
  const forgottenCards = forgottenCardsResult[0]?.count || 0;

  return {
    totalCards: regularCards + forgottenCards,
    regularCards,
    forgottenCards
  };
};
