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
  entryDate: z.union([z.string(), z.date()]), // Support both string and Date

  // FSRS Card Fields (optional - will use defaults if not provided)
  due: z.union([z.string(), z.date()]).optional(),
  stability: z.number().optional(),
  difficulty: z.number().optional(),
  elapsedDays: z.number().optional(),
  scheduledDays: z.number().optional(),
  reps: z.number().optional(),
  lapses: z.number().optional(),
  state: z.enum(["new", "learning", "review", "relearning"]).optional(),
  lastReview: z.union([z.string(), z.date()]).optional(),

  // Journal Entry Fields (optional)
  article: AricleDataSchema.optional(),
  tags: z.array(z.string()).optional(),
  mediaPath: z.string().optional(),
  mediaSourceType: z.enum(["url", "file"]).optional(),

  // Metadata (optional)
  cardType: z.enum(["default", "user"]).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export type JournalEntryContent = z.infer<typeof JournalEntryContentSchema>;
export type JournalEntryUpdate = z.infer<typeof JournalEntryUpdateSchema>;
export type ArticleData = z.infer<typeof AricleDataSchema>;
export type ImportEntry = z.infer<typeof ImportSchema>;
