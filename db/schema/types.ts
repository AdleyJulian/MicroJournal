import { State } from "ts-fsrs";
import { z } from "zod";
export const ReviewState: Record<State, string> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

// export type ArticleData = {
//   title: string;
//   description: string;
//   content: string;
//   url: string;
//   image: string;
//   publishedAt: string;
//   source: {
//     name: string;
//     url: string;
//   };
// };

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
  answer: z.string(),
});

export type JournalEntryContent = z.infer<typeof JournalEntryContentSchema>;
export type ArticleData = z.infer<typeof AricleDataSchema>;
