import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { View } from "react-native";
import { Button, Text, Card, CardHeader, CardContent } from "@/components/ui";
import { Rating } from "ts-fsrs";

// Define the Grade type locally if you can't import it
type ExcludeManual<T> = Exclude<T, Rating.Manual>;
type Grade = ExcludeManual<Rating>;

// Component for your rating buttons
export const RatingButtons = ({
  handleGrade,
  preview,
}: {
  handleGrade: (grade: Grade) => void;
  preview: Record<Grade, { card: { due: Date } }>;
}) => {
  const buttonConfigs: Array<{
    rating: Grade;
    label: string;
    color: string;
  }> = [
    {
      rating: Rating.Again,
      label: "Again",
      color: "bg-red",
    },
    {
      rating: Rating.Hard,
      label: "Hard",
      color: "bg-yellow",
    },
    {
      rating: Rating.Good,
      label: "Good",
      color: "bg-green",
    },
    {
      rating: Rating.Easy,
      label: "Easy",
      color: "bg-blue",
    },
  ];

  return (
    <View className="flex-row space-x-4">
      {buttonConfigs.map((config) => (
        <Button
          key={config.rating}
          onPress={() => handleGrade(config.rating)}
          className={`flex-1 ${config.color}-500 m-2`}
        >
          {/* <Text className="text-white">
            {formatDistanceToNow(preview[config.rating].card.due, {
              addSuffix: true,
              includeSeconds: true,
            })}
          </Text> */}
          <Text className="text-white">{config.label}</Text>
        </Button>
      ))}
    </View>
  );
};
