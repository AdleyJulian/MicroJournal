import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Save } from "~/lib/icons";
import Toast, { ToastPosition } from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { getAllEntries } from "@/db/queries";
import Papa from "papaparse";
import * as Sharing from "expo-sharing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

// Utility functions for data transformation
const transformToSimplifiedData = (entries: any[]) => {
  return entries.map(entry => {
    const { journal_cards, media_attachments } = entry;

    // Get tags - this would need to be fetched separately or passed in
    // For now, we'll create a simplified structure
    const simplified = {
      promptQuestion: journal_cards.promptQuestion,
      answer: journal_cards.answer,
      entryDate: journal_cards.entryDate,
      articleJson: journal_cards.articleJson,
      mediaPath: media_attachments?.mediaPath || null,
      mediaSourceType: media_attachments?.mediaSourceType || null,
      // Note: tags would need to be fetched separately from entryTags table
    };

    return simplified;
  });
};

const transformToFullData = (entries: any[]) => {
  return entries.map(entry => {
    const { journal_cards, media_attachments } = entry;

    return {
      id: journal_cards.id,
      // FSRS Card Fields
      due: journal_cards.due,
      stability: journal_cards.stability,
      difficulty: journal_cards.difficulty,
      elapsedDays: journal_cards.elapsedDays,
      scheduledDays: journal_cards.scheduledDays,
      reps: journal_cards.reps,
      lapses: journal_cards.lapses,
      state: journal_cards.state,
      cardType: journal_cards.cardType,
      lastReview: journal_cards.lastReview,

      // Journal Entry Fields
      promptQuestion: journal_cards.promptQuestion,
      answer: journal_cards.answer,
      articleJson: journal_cards.articleJson,
      entryDate: journal_cards.entryDate,

      // Metadata
      createdAt: journal_cards.createdAt,
      updatedAt: journal_cards.updatedAt,

      // Media attachments
      media_attachments: media_attachments,
    };
  });
};

const showToast = (type: string, text2?: string) => {
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
    case "NoEntries":
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "No entries to export",
        ...settings,
      });
      break;
    case "error":
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Export Failed",
        ...settings,
      });
      break;
    default:
      break;
  }
};

export function ExportButton() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["getAllEntries"],
    queryFn: getAllEntries,
  });

  const [isExporting, setIsExporting] = React.useState(false);
  const [dataType, setDataType] = React.useState<"full" | "simplified">("simplified");

  const handleExport = async (format: "json" | "csv") => {
    console.log("Exporting entries...");
    setIsExporting(true);

    try {
      if (!entries || entries.length === 0) {
        showToast("NoEntries");
        return;
      }
      console.log("Entries count to export: ", entries.length);

      let content: string;
      if (format === "json") {
        if (dataType === "full") {
          const fullData = transformToFullData(entries);
          content = JSON.stringify(fullData, null, 2);
        } else {
          const simplifiedData = transformToSimplifiedData(entries);
          content = JSON.stringify(simplifiedData, null, 2);
        }
      } else {
        // For CSV, we need to handle the different data structures
        if (dataType === "full") {
          const fullData = transformToFullData(entries);
          // Flatten full data structure for CSV
          const csvData = fullData.map(item => ({
            id: item.id,
            due: item.due,
            stability: item.stability,
            difficulty: item.difficulty,
            elapsedDays: item.elapsedDays,
            scheduledDays: item.scheduledDays,
            reps: item.reps,
            lapses: item.lapses,
            state: item.state,
            cardType: item.cardType,
            lastReview: item.lastReview,
            promptQuestion: item.promptQuestion,
            answer: item.answer,
            articleJson: item.articleJson ? JSON.stringify(item.articleJson) : null,
            entryDate: item.entryDate,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            mediaPath: item.media_attachments?.mediaPath || null,
            mediaSourceType: item.media_attachments?.mediaSourceType || null,
          }));
          content = Papa.unparse(csvData);
        } else {
          const simplifiedData = transformToSimplifiedData(entries);
          // Simplified data is already in a consistent format for CSV
          content = Papa.unparse(simplifiedData);
        }
      }

      console.log("Export content first 100 char", content.substring(0, 100));

      const fileName = `microjournal_export_${Date.now()}.${format}`;
      console.log("Exporting to file: ", fileName);

      // Use documentDirectory for temporary storage.
      const fileUri = FileSystem.documentDirectory + fileName;

      // Write the file to the app's internal storage.
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8, // Specify encoding for consistency
      });
      console.log("File written to:", fileUri);

      // Check if sharing is available (it should be on most devices).
      const isAvailable = await Sharing.isAvailableAsync();

      console.log("Is sharing available:", isAvailable);

      if (!isAvailable) {
        showToast("error", "Sharing is not available on this device.");
        return;
      }

      // Share the file.  This will open the device's share sheet.
      await Sharing.shareAsync(fileUri, {
        mimeType: format === "json" ? "application/json" : "text/csv", // Set MIME type
        UTI:
          format === "json"
            ? "public.json"
            : "public.comma-separated-values-text", // Uniform Type Identifier
        dialogTitle: "Share your Microjournal Export", // Optional title for the share dialog
      });

      showToast("success", `Export successful!`); //Success toast
    } catch (error: any) {
      console.error("Error exporting cards:", error);
      showToast("error", "Export Failed: " + error.message); // More informative error message
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-row items-center gap-2">
          <Save className="w-4 h-4 text-background" />
          <Text>Export Cards</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Cards</DialogTitle>
          <DialogDescription>
            Export your micro journal entries as a JSON or CSV file.
          </DialogDescription>
        </DialogHeader>

        <View className="flex flex-col gap-4 py-4">
          <View className="flex flex-row items-center gap-4">
            <Text className="flex-1 text-right">Data Type</Text>
            <View className="flex-3">
              <Select value={{ value: dataType, label: dataType === "full" ? "Full (with study data)" : "Simplified" }} onValueChange={(option) => setDataType(option?.value as "full" | "simplified")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" className="text-foreground"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem label="Simplified" value="simplified">Simplified</SelectItem>
                  <SelectItem label="Full (with study data)" value="full">Full (with study data)</SelectItem>
                </SelectContent>
              </Select>
            </View>
          </View>
        </View>

        <DialogFooter>
          <Button
            onPress={() => handleExport("json")}
            disabled={isLoading || isExporting}
          >
            <Text>Export as JSON</Text>
          </Button>
          <Button
            onPress={() => handleExport("csv")}
            disabled={isLoading || isExporting}
          >
            <Text>Export as CSV</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
