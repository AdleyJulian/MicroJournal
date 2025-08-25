/**
 * Simplified sharing utilities using react-native-share
 * Provides reliable text-only sharing across platforms
 * No image complications - just pure, simple text sharing
 */

import Share from 'react-native-share';
import { formatDateForDisplay } from './dateUtils';
import { type JournalEntry, type MediaAttachment } from '@/db/schema/schema';

/**
 * Formats a journal entry into a shareable text message
 */
export const formatEntryMessage = (entry: JournalEntry): string => {
  const dateStr = formatDateForDisplay(new Date(entry.entryDate).toISOString().split('T')[0]);
  const question = entry.promptQuestion || 'Journal Entry';
  const answer = entry.answer || 'No response recorded';

  return `Memory from ${dateStr}

${question}

${answer}

Shared from Pensieve`;
};

/**
 * Main sharing function using react-native Share (text only)
 */
export const shareTextOnly = async (message: string): Promise<void> => {
  try {
    const result = await Share.open({
      message: message,
      title: 'Share Memory',
    });

    console.log('Memory shared successfully:', result);
  } catch (error) {
    console.error('react-native Share Error:', error);
    throw error;
  }
};

// Removed unused base64 conversion functions - using simplified text-only sharing

/**
 * Simplified sharing function - only shares text (no image complications)
 */
export const shareWithImageAndText = async (
  message: string,
  imagePath?: string,
  entryPrompt?: string
): Promise<void> => {
  // For now, just share text regardless of whether there's an image
  console.log('Simplified sharing: sharing text only');
  await shareTextOnly(message);
};



/**
 * Shares a journal entry - simplified to text only
 */
export const shareEntryWithImage = async (
  entry: JournalEntry,
  media: MediaAttachment | null
): Promise<void> => {
  const message = formatEntryMessage(entry);

  // If there's media, add a note about it
  const finalMessage = media?.mediaPath
    ? `${message}\n\n📷 This memory includes a photo.`
    : message;

  console.log('Sharing entry with simplified text-only approach');
  await shareTextOnly(finalMessage);
};

// Removed unused utility functions - using simplified text-only sharing
