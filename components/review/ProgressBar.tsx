import { View } from "react-native";
import { Text } from "@/components/ui";
export const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <View className="px-4 py-2">
    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <View
        className="h-full bg-blue-500 rounded-full"
        style={{
          width: `${(current / total) * 100}%`,
        }}
      />
    </View>
    <Text className="text-center text-muted-foreground mt-1">
      {current} of {total} entries reviewed
    </Text>
  </View>
);
