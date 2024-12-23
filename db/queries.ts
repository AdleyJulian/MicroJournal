import { db } from "@/db/client";
import { journalEntries, tags, entryTags } from "@/db/schema/schema";
import { desc, eq, lte } from "drizzle-orm";

export const getAllEntries = async () => {
  return await db.select().from(journalEntries);
};

export const getEntryById = async (id: number) => {
  return await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.id, id));
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
