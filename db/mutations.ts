import { db } from "@/db/client";
import {
  journalEntries,
  type JournalEntry,
  mediaAttachments,
} from "@/db/schema/schema"; // Import mediaAttachments
import { desc, eq, and, sql } from "drizzle-orm";
import {
  JournalEntryContent,
  ArticleData,
  JournalEntryUpdate,
  ReviewState,
} from "./schema/types";
import { newCard, type ReviewGrade, reviewEntry } from "./fsrs";
import * as FileSystem from "expo-file-system";
import { Grade, RatingType, State } from "ts-fsrs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function newEntry(entry: JournalEntryContent, cardType?: string) {
  const card = newCard(entry);
  type CardType = "default" | "user";

  console.log("Recieved Entry", entry);

  // Prepare journal entry data (without image for now, as per schema update)
  const newJournalEntry = {
    cardType:
      cardType === "default" || cardType === "user"
        ? cardType
        : ("default" as CardType), // Validate cardType
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
    entryDate: new Date(entry.entryDate), // Convert to timestamp
    createdAt: new Date(),
    updatedAt: new Date(),
    articleJson: entry.article || null, // Assuming article is optional in JournalEntryContent
  };

  try {
    // 1. Insert the journal entry first and get its ID
    const createdEntry = db
      .insert(journalEntries)
      .values(newJournalEntry)
      .returning({ id: journalEntries.id }) // Return the id of the newly inserted entry
      .get(); // Use .get() to get a single record back

    if (entry.mediaPath && entry.mediaSourceType && createdEntry) {
      console.log("Creating media attachment for entry ID:", createdEntry.id);
      // 2. If mediaPath and mediaSourceType are provided in entry content, create mediaAttachment
      const newMediaAttachment = {
        entryId: createdEntry.id, // Use the ID of the journal entry just created
        mediaPath: entry.mediaPath,
        mediaSourceType: entry.mediaSourceType,
        type: "image", // Assuming type is always image for this function, you can make it dynamic if needed
      };
      await db.insert(mediaAttachments).values(newMediaAttachment).run();
    }

    const NewCard = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, createdEntry.id));
    const media = await db
      .select()
      .from(mediaAttachments)
      .where(eq(mediaAttachments.entryId, createdEntry.id));
    console.log("New Card Created:", NewCard);
    console.log("Media Created:", media);
    return createdEntry; // Optionally return the created entry (at least the ID) for further use
  } catch (error) {
    console.error("Error creating new journal entry and media:", error);
    // Handle error appropriately, maybe re-throw or return null/error indicator
    throw new Error("Failed to create new journal entry and media."); // Or handle more gracefully
  }
}

export async function deleteEntry(id: number) {
  console.log("Deleting entry with ID:", id);
  try {
    console.log("Fetching media attachments for entry ID:", id);
    const attachments = await db
      .select({ mediaPath: mediaAttachments.mediaPath })
      .from(mediaAttachments)
      .where(
        and(
          eq(mediaAttachments.entryId, id),
          eq(mediaAttachments.mediaSourceType, "file")
        )
      );
    console.log("Media attachments found:", attachments);
    for (const file in attachments) {
      const filePath = attachments[file].mediaPath;
      console.log("Deleting file:", filePath);
      await FileSystem.deleteAsync(filePath);
    }
  } catch (error) {
    console.error("Error fetching media attachments:", error);
  }

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

export const updateEntryWithMedia = async (input: JournalEntryUpdate) => {
  const { id, mediaPath, mediaSourceType } = input;

  try {
    await db.transaction(async (tx) => {
      // Check for existing media
      const existingMedia = await tx
        .select()
        .from(mediaAttachments)
        .where(eq(mediaAttachments.entryId, Number(id)))
        .get();

      if (mediaPath && mediaSourceType) {
        if (!existingMedia) {
          // Insert new media
          const newMediaAttachment = {
            entryId: Number(id),
            mediaPath: mediaPath,
            mediaSourceType: mediaSourceType,
            type: "image",
          };
          await tx.insert(mediaAttachments).values(newMediaAttachment).run();
        } else if (
          existingMedia.mediaPath !== mediaPath ||
          existingMedia.mediaSourceType !== mediaSourceType
        ) {
          // Update existing media
          await tx
            .update(mediaAttachments)
            .set({ mediaPath, mediaSourceType })
            .where(eq(mediaAttachments.entryId, Number(id)))
            .run();

          // Delete old image file
          if (
            existingMedia.mediaSourceType === "file" &&
            existingMedia.mediaPath
          ) {
            await FileSystem.deleteAsync(existingMedia.mediaPath);
          }
        }
      } else if (existingMedia) {
        // Delete existing media if no new media is provided
        await tx
          .delete(mediaAttachments)
          .where(eq(mediaAttachments.entryId, Number(id)))
          .run();

        // Delete old image file
        if (existingMedia.mediaSourceType === "file") {
          await FileSystem.deleteAsync(existingMedia.mediaPath);
        }
      }

      // Update journal entry
      await tx
        .update(journalEntries)
        .set({
          promptQuestion: input.promptQuestion,
          answer: input.answer,
          entryDate: new Date(input.entryDate),
          updatedAt: new Date(),
          articleJson: input.article,
        })
        .where(eq(journalEntries.id, Number(id)))
        .run();
    });
  } catch (error) {
    console.error("Error updating entry with media:", error);
    // Handle error appropriately
  }
};

export const updateEntrywithReview = async (input: {
  entry: JournalEntry;
  grade: Grade;
}) => {
  const { entry, grade } = input;
  const { card, log } = await reviewEntry(entry, grade);
  console.log("Updating entry with review:", JSON.stringify(entry, null, 2));
  console.log("Card after review:", JSON.stringify(card, null, 2));

  const newStateString = ReviewState[card.state as State];

  const result: JournalEntry = {
    id: entry.id,
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: newStateString,
    entryDate: entry.entryDate,
    updatedAt: new Date(),
    promptQuestion: entry.promptQuestion,
    answer: entry.answer,
    createdAt: entry.createdAt,
    articleJson: entry.articleJson || null,
    cardType: entry.cardType || "user", // Ensure cardType is set
    lastReview: card.last_review || null, // Ensure lastReview is set
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
};

export const insertEntries = async (entries: JournalEntryContent[]) => {
  const cards = entries.map((entry) => {
    const card = newCard(entry);
    return {
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
      entryDate: new Date(entry.entryDate), // Convert to timestamp
      createdAt: new Date(),
      updatedAt: new Date(),
      articleJson: null, // Assuming article is optional in JournalEntryContent
    };
  });

  try {
    await db.insert(journalEntries).values(cards).run();
  } catch (error) {
    console.error("Error inserting entries:", error);
  }
};

export async function createDailyDayOfWeekEntry() {
  try {
    const defaultCardsSetting = await AsyncStorage.getItem(
      "defaultCardsSetting"
    );
    // If the setting is not explicitly false, proceed to create the card.
    // This covers cases where it's true or not set yet (defaulting to true behavior).
    if (defaultCardsSetting !== "false") {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const dayOfWeek = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const promptQuestion = `📅 What day of the week was ${formattedDate}?`;

      // Check if an entry with the same prompt question already exists for today
      const existingEntry = await db
        .select()
        .from(journalEntries)
        .where(and(eq(journalEntries.promptQuestion, promptQuestion)))
        .get();

      if (!existingEntry) {
        const entryContent: JournalEntryContent = {
          promptQuestion: promptQuestion,
          answer: dayOfWeek,
          entryDate: currentDate,
          tags: [],
          article: null,
        };
        await newEntry(entryContent, "default");
        console.log("Daily day of the week entry created.");
      } else {
        console.log("Daily day of the week entry already exists for today.");
      }
    } else {
      console.log("Default card creation is disabled by user setting.");
    }
  } catch (error) {
    console.error("Error creating daily day of the week entry:", error);
  }
}
