import React from "react";
import { View, Text } from "react-native";

interface StateCountProps {
  statesCount: {
    New: number;
    Learning: number;
    Review: number;
    Relearning: number;
  };
}

// Define the type for the state keys
type StateKey = "New" | "Learning" | "Review" | "Relearning";

export const StateCount: React.FC<StateCountProps> = ({ statesCount }) => {
  const stateColors: Record<StateKey, string> = {
    New: "bg-gray-400",
    Learning: "bg-gray-500",
    Review: "bg-gray-600",
    Relearning: "bg-gray-700",
  };
  return (
    <View className="flex-row justify-around w-full mt-2 mb-4">
      {Object.entries(statesCount).map(([state, count]) => (
        <View key={state} className="items-center">
          <View
            className={`${stateColors[state as StateKey]} px-3 py-2 rounded-lg mb-1`}
          >
            <Text className="text-lg font-medium text-white">{count}</Text>
          </View>
          <Text className="text-xs text-foreground">{state}</Text>
        </View>
      ))}
    </View>
  );
};
