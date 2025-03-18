import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as queries from "@/db/queries";
import * as mutations from "@/db/mutations";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import { ScrollView } from "react-native-gesture-handler";
import {
  EntryHeader,
  MediaSection,
  EntryMetrics,
  EntryActions,
} from "@/components/entries/";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
export default function JournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getEntryById", id],
    queryFn: () => queries.getEntryById(parseInt(id)),
  });

  useRefreshOnFocus(refetch);

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-background p-4">
        <Text className="text-2xl font-bold">Error loading entry</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background">
      <ScrollView>
        <EntryHeader entry={data.journal_cards} isLoading={isLoading} />
        {/* <EntryContent entry={data.journal_cards} isLoading={isLoading} /> */}
        <MediaSection
          media={data.media_attachments}
          entry={data.journal_cards}
          isLoading={isLoading}
        />
        <EntryMetrics entry={data.journal_cards} isLoading={isLoading} />
        <EntryActions entryId={id} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}
