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
          (entry: any) => ImportSchema.safeParse(entry).success
        );

        const convertedImport = validEntries.map((entry: any) => ({
          ...entry,
          entryDate: new Date(entry.entryDate),
        }));
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
        (entry: any) => ImportSchema.safeParse(entry).success
      );

      const convertedImport = validEntries.map((entry: any) => ({
        ...entry,
        entryDate: new Date(entry.entryDate),
      }));

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
        <Button>
          <Text>Import Cards</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Cards</DialogTitle>
          <DialogDescription>
            Please provide input as a JSON file with the format: [&#123;
            "promptQuestion": "...", "answer": "...", "entryDate": "YYYY-MM-DD"
            &#125;, ...]
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
