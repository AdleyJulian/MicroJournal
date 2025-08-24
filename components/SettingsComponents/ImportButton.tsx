import { insertEntries } from "@/db/mutations";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons";
import Toast, { ToastPosition } from "react-native-toast-message";
import { ImportSchema } from "@/db/schema/types";
import JSON5 from "json5";
import * as FileSystem from "expo-file-system";
import { Textarea } from "../ui";

import * as DocumentPicker from "expo-document-picker";

const showToast = (type: string) => {
  const settings = {
    visibilityTime: 2000,
    autoHide: true,
    onPress() {
      Toast.hide();
    },
    position: "bottom" as ToastPosition,
    bottomOffset: 80,
  };
  switch (type) {
    case "error":
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Import Failed",
        ...settings,
      });
      break;
    case "success":
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Import Success",
        ...settings,
      });
      break;
    default:
      break;
  }
};

export function ImportButton() {
  const mutation = useMutation({
    mutationFn: insertEntries,
    onSuccess: () => {
      showToast("success");
    },
    onError: () => {
      showToast("error");
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [textAreaValue, setTextAreaValue] = React.useState("");

  const handleImport = async () => {
    setIsLoading(true);

    try {
      const doc = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      const { assets } = doc;

      if (assets && assets.length > 0) {
        const asset = assets;
        const contents = await FileSystem.readAsStringAsync(asset[0].uri);
        const jsonData = JSON5.parse(contents);

        const validEntries = jsonData.filter(
          (entry: any) => {
            const result = ImportSchema.safeParse(entry);
            if (!result.success) {
              console.warn("Invalid entry skipped:", entry, result.error.issues);
            }
            return result.success;
          }
        );

        const convertedImport = validEntries.map((entry: any) => {
          // Convert date strings to Date objects
          const convertedEntry = { ...entry };

          if (typeof entry.entryDate === 'string') {
            convertedEntry.entryDate = new Date(entry.entryDate);
          }
          if (entry.due && typeof entry.due === 'string') {
            convertedEntry.due = new Date(entry.due);
          }
          if (entry.lastReview && typeof entry.lastReview === 'string') {
            convertedEntry.lastReview = new Date(entry.lastReview);
          }
          if (entry.createdAt && typeof entry.createdAt === 'string') {
            convertedEntry.createdAt = new Date(entry.createdAt);
          }
          if (entry.updatedAt && typeof entry.updatedAt === 'string') {
            convertedEntry.updatedAt = new Date(entry.updatedAt);
          }

          return convertedEntry;
        });
        mutation.mutate(convertedImport);
      }
    } catch (error) {
      console.error("Error importing cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitText = () => {
    try {
      const jsonData = JSON5.parse(textAreaValue);
      const validEntries = jsonData.filter(
        (entry: any) => {
          const result = ImportSchema.safeParse(entry);
          if (!result.success) {
            console.warn("Invalid entry skipped:", entry, result.error.issues);
          }
          return result.success;
        }
      );

      const convertedImport = validEntries.map((entry: any) => {
        // Convert date strings to Date objects
        const convertedEntry = { ...entry };

        if (typeof entry.entryDate === 'string') {
          convertedEntry.entryDate = new Date(entry.entryDate);
        }
        if (entry.due && typeof entry.due === 'string') {
          convertedEntry.due = new Date(entry.due);
        }
        if (entry.lastReview && typeof entry.lastReview === 'string') {
          convertedEntry.lastReview = new Date(entry.lastReview);
        }
        if (entry.createdAt && typeof entry.createdAt === 'string') {
          convertedEntry.createdAt = new Date(entry.createdAt);
        }
        if (entry.updatedAt && typeof entry.updatedAt === 'string') {
          convertedEntry.updatedAt = new Date(entry.updatedAt);
        }

        return convertedEntry;
      });

      mutation.mutate(convertedImport);
      setTextAreaValue(""); // Clear the textarea after submission
    } catch (error) {
      console.error("Error importing from text:", error);
      showToast("error"); // Show error toast in case of parsing or validation errors
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-row items-center gap-2">
          <Plus className="w-4 h-4 text-background" />
          <Text>Import Cards</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Cards</DialogTitle>
          <DialogDescription>
            Import cards with full details. Basic format: [&#123;"promptQuestion": "...", "answer": "...", "entryDate": "YYYY-MM-DD"&#125;, ...]
            {"\n\n"}
            Advanced format supports: FSRS state (stability, difficulty, due date, current state), tags, articles, media, and metadata.
            {"\n\n"}
            Example:
            {"\n"}&#123;
            {"\n"}  "promptQuestion": "What was the main event today?",
            {"\n"}  "answer": "I learned about spaced repetition",
            {"\n"}  "entryDate": "2024-01-15",
            {"\n"}  "stability": 2.5,
            {"\n"}  "difficulty": 1.8,
            {"\n"}  "state": "review",
            {"\n"}  "due": "2024-01-20",
            {"\n"}  "reps": 3,
            {"\n"}  "tags": ["learning", "spaced-repetition"],
            {"\n"}  "cardType": "user"
            {"\n"}&#125;
          </DialogDescription>
        </DialogHeader>
        <Button onPress={handleImport} disabled={isLoading}>
          <Text>JSON File (.json, .txt)</Text>
        </Button>
        <Textarea
          className="h-40"
          value={textAreaValue}
          placeholder="Paste JSON here"
          placeholderTextColor="#9CA3AF"
          onChangeText={setTextAreaValue}
          aria-labelledby="textareaLabel"
        />
        <DialogFooter>
          <Button onPress={handleSubmitText}>
            <Text>Submit Text</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
