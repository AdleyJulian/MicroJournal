import { View } from "react-native";
import { Button, Text } from "@/components/ui";
import { Rating } from "ts-fsrs";

const formatTimeUntilReview = (dueDate: Date) => {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) return "< 1m";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  if (diffMonths < 12) return `${diffMonths}mo`;
  return `${diffYears}y`;
};

// Define the Grade type locally if you can't import it
type ExcludeManual<T> = Exclude<T, Rating.Manual>;
type Grade = ExcludeManual<Rating>;

// Component for your rating buttons
export const RatingButtons = ({
  handleGrade,
  preview,
  showAnswer = false,
  // isAheadCard = false,
}: {
  handleGrade: (grade: Grade) => void;
  preview: Record<Grade, { card: { due: Date } }>;
  showAnswer?: boolean;
  // isAheadCard?: boolean;
}) => {
  const buttonConfigs: {
    rating: Grade;
    label: string;
    color: string;
  }[] = [
    {
      rating: Rating.Again,
      label: "Again",
      color: "bg-red-500",
    },
    {
      rating: Rating.Hard,
      label: "Hard",
      color: "bg-yellow-500",
    },
    {
      rating: Rating.Good,
      label: "Good",
      color: "bg-green-500",
    },
    {
      rating: Rating.Easy,
      label: "Easy",
      color: "bg-blue-500",
    },
  ];

  return (
    <View className={`flex-row justify-between px-2 py-2 ${!showAnswer || !preview ? 'hidden' : ''}`}>
      {/* {isAheadCard && (
        <View className="absolute top-0 left-0 right-0 bg-blue-100 border-l-4 border-blue-500 px-3 py-1 rounded-t-lg">
          <Text className="text-blue-800 text-xs font-medium">Review Ahead</Text>
        </View>
      )} */}
      {buttonConfigs.map((config) => (
        <Button
          key={config.rating}
          onPress={() => handleGrade(config.rating)}
          className={`${config.color} flex-1 mx-1 py-3 px-2 rounded-lg shadow-sm`}
        >
          <View className="items-center">
            <Text className="text-primary-foreground font-bold text-sm">{config.label}</Text>
            <Text className="text-primary-foreground text-xs opacity-95 font-medium">
              {preview && preview[config.rating] ? formatTimeUntilReview(preview[config.rating].card.due) : ''}
            </Text>
          </View>
        </Button>
      ))}
    </View>
  );
};
