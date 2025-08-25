import * as FileSystem from 'expo-file-system';
import { Share } from 'react-native';
import { formatDateForDisplay } from './dateUtils';
import { type JournalEntry, type MediaAttachment } from '@/db/schema/schema';

/**
 * Formats a journal entry into a shareable text message
 */
export const formatEntryMessage = (entry: JournalEntry): string => {
  const dateStr = formatDateForDisplay(new Date(entry.entryDate).toISOString().split('T')[0]);
  const question = entry.promptQuestion || 'Journal Entry';
  const answer = entry.answer || 'No response recorded';

  return `📝 Memory from ${dateStr}

❓ ${question}
💭 ${answer}

Shared from Pensieve Journal`;
};

/**
 * Main sharing function using React Native's Share module
 */
export const shareTextWithRN = async (message: string): Promise<void> => {
  try {
    const result = await Share.share({
      message: message,
      title: 'Share Memory',
    });

    if (result.action === Share.sharedAction) {
      console.log('Memory shared successfully');
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed by user');
    }
  } catch (error) {
    console.error('RN Share - Error:', error);
    throw error;
  }
};



/**
 * Shares a journal entry with optional image attachment
 */
export const shareEntryWithImage = async (
  entry: JournalEntry,
  media: MediaAttachment | null
): Promise<void> => {
  const message = formatEntryMessage(entry);

  try {
    // Check if we have a valid image to share
    if (media && media.mediaPath && media.mediaSourceType === 'file') {
      // Additional safety check for file path
      if (typeof media.mediaPath === 'string' && media.mediaPath.startsWith('file://')) {
        // Verify the file exists
        const fileInfo = await FileSystem.getInfoAsync(media.mediaPath);

        if (fileInfo.exists) {
          // For now, we'll share the text message even when there's an image
          // since React Native Share doesn't support images directly
          // TODO: Implement image sharing when needed
          console.log('Image found but sharing text message for compatibility');
        }
      }
    }

    // Use React Native Share as the primary method
    await shareTextWithRN(message);

  } catch (error) {
    console.error('Error sharing entry:', error);
    throw new Error('Unable to share this memory. Please try again.');
  }
};

/**
 * Determines MIME type based on file extension
 */
const getMimeTypeFromPath = (filePath: string): string => {
  const extension = filePath.toLowerCase().split('.').pop();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // Default fallback
  }
};
