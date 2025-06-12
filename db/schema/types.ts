import { State } from "ts-fsrs";
import { z } from "zod";
export const ReviewState: Record<State, string> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

export const AricleDataSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
    url: z.string(),
    image: z.string(),
    publishedAt: z.string(),
    source: z.object({
      name: z.string(),
      url: z.string(),
    }),
  })
  .nullable();

export const JournalEntryContentSchema = z.object({
  tags: z.array(z.string()),
  article: AricleDataSchema,
  promptQuestion: z.string(),
  mediaPath: z.string().optional(), // Could be a URL or file path - optional as image is optional
  mediaSourceType: z.enum(["url", "file"]).optional(), //  optional as image is optional, if mediaPath is present, sourceType should be too.  You might want to enforce this more strictly in your application logic.
  answer: z.string(),
  entryDate: z.date(), // Unix timestamp
});

export const JournalEntryUpdateSchema = JournalEntryContentSchema.extend({
  id: z.string(),
});

export const ImportSchema = z.object({
  promptQuestion: z.string(),
  answer: z.string(),
  entryDate: z.string().date(), // Unix timestamp
});

export type JournalEntryContent = z.infer<typeof JournalEntryContentSchema>;
export type JournalEntryUpdate = z.infer<typeof JournalEntryUpdateSchema>;
export type ArticleData = z.infer<typeof AricleDataSchema>;
