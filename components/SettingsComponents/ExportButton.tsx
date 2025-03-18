import { useQuery } from "@tanstack/react-query";
import * as React from "react";
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
import Toast, { ToastPosition } from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { getAllEntries } from "@/db/queries";
import Papa from "papaparse";
import * as Sharing from "expo-sharing";

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

  const handleExport = async (format: "json" | "csv") => {
    console.log("Exporting entries...");
    setIsExporting(true);

    try {
      if (!entries || entries.length === 0) {
        showToast("NoEntries");
        return;
      }
      console.log("Entries count to export: ", entries.length);

      const content =
        format === "json" ? JSON.stringify(entries) : Papa.unparse(entries);

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
        <Button>
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
