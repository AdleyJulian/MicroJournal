import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDatabase } from "~/db/provider";
import { AllEntries } from "~/components/AllEntries";
import { useEffect, useState } from "react";

import { journalEntries, type JournalEntry } from "~/db/schema/schema";

export default function Explore() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <AllEntries />
    </SafeAreaView>
  );
}
