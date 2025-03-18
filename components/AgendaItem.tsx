import React, { memo } from "react";
import { View, Text, Pressable, SectionListRenderItem } from "react-native";

import { type JournalEntry } from "@/db/schema/schema";
import { format } from "date-fns"; // Import date-fns for formatting
import { parseISO } from "date-fns/parseISO";
import { Link } from "expo-router";

export const AgendaItem = memo(
  ({ item }: { item: JournalEntry }) => {
    return (
      <Link asChild href={{ pathname: "/entries", params: { id: item.id } }}>
        <Pressable
          className="p-3 mb-2 shadow-sm bg-card"
          style={{ elevation: 1 }}
          //   onLongPress={() => console.log("Item pressed:", JSON.stringify(item))}
        >
          <View className="flex-row items-start space-x-3">
            {/* Status indicator */}

            {/* Content */}
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-800 dark:text-gray-100 mb-1">
                {item.promptQuestion || "No question provided"}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {item.answer || "No answer provided"}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    // Prevent re-render if the item hasn't changed
    return prevProps.item.id === nextProps.item.id;
  }
);

export const AgendaListHeader = ({ day }: { day: any }) => {
  const parsedDate = parseISO(day.toString()); // Parse the date string to a Date object

  const formattedDate = format(parsedDate, "MMM dd, yyyy"); // Format the date

  return (
    <Pressable
      className="bg-background py-2 px-4 border-b border-gray-200"
      onLongPress={() =>
        console.log(
          "Day pressed:",
          JSON.stringify(day),
          "formattedDate: ",
          formattedDate
        )
      }
    >
      <Text className="text-card-foreground font-semibold text-lg">
        {formattedDate}
      </Text>
    </Pressable>
  );
};
