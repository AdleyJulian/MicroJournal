import React, { JSX } from "react";
import { View } from "react-native";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Text,
} from "@/components/ui";
import { TrendingUp, Activity, Brain, RotateCcw } from "@/lib/icons";
import { type JournalEntry } from "@/db/schema/schema";
import { formatDistance } from "date-fns/formatDistance";

// Helper to get color based on value
function getMetricColor(value: number, max: number): string {
  const percentage = value / max;
  if (percentage >= 0.8) return "text-green-500";
  if (percentage >= 0.5) return "text-yellow-500";
  return "text-red-500";
}

// Helper to get state display info
function getStateInfo(state: string): { label: string; color: string } {
  const states: Record<string, { label: string; color: string }> = {
    0: { label: "New", color: "bg-blue-500" },
    1: { label: "Learning", color: "bg-yellow-500" },
    2: { label: "Review", color: "bg-green-500" },
    3: { label: "Relearning", color: "bg-red-500" },
  };
  return states[state] || { label: state, color: "bg-gray-500" };
}

interface EntryMetricsProps {
  entry: JournalEntry;
  isLoading?: boolean;
}
export function EntryMetrics({ entry, isLoading }: EntryMetricsProps) {
  if (isLoading) {
    // ... (Loading state remains the same)
  }

  const stateInfo = getStateInfo(entry.state);
  const stabilityColor = getMetricColor(entry.stability, 100);
  const difficultyColor = getMetricColor(1 - entry.difficulty, 1);

  return (
    <Card className="mt-4 mx-4">
      <CardHeader>
        <CardTitle className="text-xl">Learning Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* State Information */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm">Current State</Text>
          <View className={`px-2 py-1 rounded ${stateInfo.color}`}>
            <Text className="text-white text-xs font-medium">
              {stateInfo.label}
            </Text>
          </View>
        </View>

        {/* Metrics Grid - Improved */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Responsive grid */}
          <MetricItem
            icon={<TrendingUp className="w-6 h-6 text-muted-foreground mr-2" />} // Larger icon
            label="Stability"
            value={entry.stability.toFixed(1)}
            color={stabilityColor}
            description="Memory retention strength"
          />
          <MetricItem
            icon={<Activity className="w-6 h-6 text-muted-foreground mr-2" />} // Larger icon
            label="Difficulty"
            value={entry.difficulty.toFixed(2)}
            color={difficultyColor}
            description="Learning complexity"
          />
        </View>

        {/* Review Stats - Improved */}
        <View className="bg-card p-4 rounded-lg">
          {/* Consistent padding */}
          <View className="flex-row justify-between items-center">
            {/* Align items in row */}
            <View>
              <Text className="text-sm mb-1">Reviews</Text>
              <View className="flex-row items-center space-x-2">
                <RotateCcw className="w-6 h-6 text-muted-foreground mr-2" />
                {/* Larger icon */}
                <Text className="text-foreground">
                  {entry.reps} times · {entry.lapses} lapses
                </Text>
              </View>
            </View>
            <View className="text-right">
              {/* Align next review to the right */}
              <Text className="text-sm text-muted-foreground">
                Next:
                {formatDistance(new Date(entry.due), new Date(), {
                  addSuffix: true,
                })}
              </Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

// Reusable Metric Item Component
const MetricItem = ({
  icon,
  label,
  value,
  color,
  description,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
  color: string;
  description: string;
}) => (
  <View className="bg-card p-4 rounded-lg">
    {/* Consistent padding */}
    <View className="flex-row items-center space-x-3 mb-2">
      {/* Increased spacing */}
      {icon}
      <Text className="text-sm">{label}</Text>
    </View>
    <Text className={`text-2xl font-medium ${color}`}>{value}</Text>
    {/* Larger value */}
    <Text className="text-xs text-muted-foreground">{description}</Text>
  </View>
);
