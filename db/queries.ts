import { db } from "@/db/client";
import {
  journalEntries,
  tags,
  entryTags,
  mediaAttachments,
} from "@/db/schema/schema";
import { desc, eq, lte, count, and, gte } from "drizzle-orm";
import { type JournalEntry, type MediaAttachment } from "@/db/schema/schema";

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
    .orderBy(desc(journalEntries.entryDate));
  // return await db.select().from(journalEntries);
};

export const getAllEntriesGroupedByDate = async () => {
  // First get all entries with their attachments
  const entries = await getAllEntries();
  const groupedEntries: { [key: string]: any[] } = {}; // Group entries by date string

  entries.forEach((entry) => {
    const { journal_cards, media_attachments } = entry;
    const { entryDate } = journal_cards;
    const index = Number(entryDate);

    const date = journal_cards.entryDate.toISOString().split("T")[0];

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
