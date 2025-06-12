import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import {
  text,
  integer,
  real,
  sqliteTable,
  unique,
} from "drizzle-orm/sqlite-core";
import { type ArticleData } from "./types";
import { State } from "ts-fsrs";

// Enum to match ts-fsrs State
// Card State Enum (matching ts-fsrs states)
export enum CardState {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}
// Journal Cards Table (Direct FSRS Card Storage)
export const journalEntries = sqliteTable("journal_cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // FSRS Card Fields (Direct Mapping)
  due: integer("due", { mode: "timestamp" }).notNull(),
  stability: real("stability").notNull(),
  difficulty: real("difficulty").notNull(),
  elapsedDays: integer("elapsed_days").notNull(),
  scheduledDays: integer("scheduled_days").notNull(),
  reps: integer("reps").notNull(),
  lapses: integer("lapses").notNull(),
  state: text("state", {
    enum: Object.values(State) as [string, ...string[]], // Use the enum values directly
  }).notNull(),
  cardType: text("card_type", { enum: ["default", "user"] }).default("user"),
  lastReview: integer("last_review", { mode: "timestamp" }), // Last review timestamp

  // Journal Entry Fields
  promptQuestion: text("prompt_question"),
  answer: text("answer"),
  articleJson: text("jsonData").$type<ArticleData>(),
  entryDate: integer("entry_date", { mode: "timestamp" }).notNull(),

  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

// Tags Table (for Roam-style tagging)
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

// Junction Table for Journal Entries and Tags (Many-to-Many Relationship)
export const entryTags = sqliteTable(
  "entry_tags",
  {
    entryId: integer("entry_id").references(() => journalEntries.id, {
      onDelete: "cascade",
    }),
    tagId: integer("tag_id").references(() => tags.name, {
      onDelete: "cascade",
    }),
  },
  (table) => ({
    // Composite unique constraint to prevent duplicate tags on an entry
    unqComposite: unique().on(table.entryId, table.tagId),
  })
);

// Optional: Media Attachments Table
export const mediaAttachments = sqliteTable("media_attachments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entryId: integer("entry_id").references(() => journalEntries.id, {
    onDelete: "cascade",
  }),
  mediaPath: text("file_path").notNull(), // Renamed from filePath to mediaPath - will store URL or file path
  mediaSourceType: text("media_source_type", {
    // NEW field to define if it's 'url' or 'file'
    enum: ["url", "file"] as [string, ...string[]], // Using enum for type safety
  }).notNull(),
  type: text("type"), // 'image', 'video', 'audio', etc. - Keeping it for future use
  caption: text("caption"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

const MediaSourceType = z.enum(["url", "file"]);
type MediaSourceType = z.infer<typeof MediaSourceType>;

export const journalSchema = createSelectSchema(journalEntries);
export type JournalEntry = z.infer<typeof journalSchema>;
export const tagSchema = createSelectSchema(tags);
export type Tag = z.infer<typeof tagSchema>;
export const entryTagSchema = createSelectSchema(entryTags);
export type EntryTag = z.infer<typeof entryTagSchema>;
export const mediaAttachmentSchema = createSelectSchema(mediaAttachments);
//.extend({  mediaSourceType: MediaSourceType});
// May want to add this in the future.
export type MediaAttachment = z.infer<typeof mediaAttachmentSchema>;
