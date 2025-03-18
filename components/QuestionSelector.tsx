import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { cn } from "../lib/utils";
import { MessageSquareText } from "@/lib/icons";
import { Textarea, Button, Text } from "./ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Link } from "expo-router";
import { FormLabel } from "~/components/ui/form";

type Question = {
  value: string;
  index: number;
};

export const defaultQuestions: Question[] = [
  {
    value: "🌟 What was the best part of your day?",
    index: 0,
  },
  {
    value: "📍 What interesting place did you visit today?",
    index: 1,
  },
  { value: "💼 What did you work on?", index: 2 },
  { value: "📚 What did you read/watch?", index: 3 },
  { value: "🤝 Did you meet anyone new?", index: 4 },
];

interface QuestionSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  error?: string;
}

export const FormQuestionSelector = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  error,
  ...props
}: QuestionSelectorProps<TFieldValues, TName>) => {
  return (
    <Controller
      {...props}
      render={({ field: { value, onChange } }) => (
        <QuestionSelector error={error} value={value} onChange={onChange} />
      )}
    />
  );
};

interface QuestionSelectorBaseProps {
  label?: string;
  error?: string;
  value?: Question;
  onChange: (question: Question) => void;
}

const QuestionSelector: React.FC<QuestionSelectorBaseProps> = ({
  label,
  error,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayedQuestionText, setDisplayedQuestionText] = useState("");

  const windowHeight = Dimensions.get("window").height;
  const modalHeight = windowHeight * 0.7;

  useEffect(() => {
    loadQuestions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQuestions();
    }, [])
  );

  const loadQuestions = async () => {
    setQuestions(defaultQuestions);
    try {
      const storedQuestions = await AsyncStorage.getItem("questions");
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      } else {
        await AsyncStorage.setItem(
          "questions",
          JSON.stringify(defaultQuestions)
        );
      }
    } catch (error) {
      console.error("Error loading questions from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    if (value) {
      setDisplayedQuestionText(value.value);
    }
  }, [value]);

  const handleSelect = (question: Question) => {
    onChange(question);
    setIsOpen(false);
  };

  const handleTextChange = (newText: string) => {
    setDisplayedQuestionText(newText);
    onChange({ value: newText, index: -1 });
  };

  return (
    <View className="w-full">
      {label && <FormLabel>{label}</FormLabel>}
      <View
        className={cn(
          "flex flex-row border rounded-lg overflow-hidden",
          error ? "border-destructive" : "border-input", // Changed border colors to semantic
          "focus:border-primary" // Changed focus border to semantic
        )}
      >
        <Textarea
          value={displayedQuestionText}
          onChangeText={handleTextChange}
          editable={true}
          multiline={true}
          className={cn(
            "flex-1 p-4 text-base min-h-[100]",
            !value && "text-muted-foreground" // Changed placeholder text color to semantic
          )}
          placeholder="Select a question..."
          // placeholderClassName="text-muted-foreground" // Changed placeholder text color to semantic
          placeholderTextColor="#9CA3AF" // Bug in NativeWind, using inline style for now
          textAlignVertical="top"
        />
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          className={cn(
            "p-4 border-l border-border justify-center bg-secondary"
          )} // Changed button and border colors to semantic
        >
          <MessageSquareText className="h-6 w-6 text-muted-foreground" />
          {/* Changed icon color to semantic */}
        </TouchableOpacity>
      </View>
      {error && <Text className="mt-1 text-sm text-destructive">{error}</Text>}
      {/* Changed error text color to semantic */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className="flex-1 bg-black/50 justify-center">
            <TouchableWithoutFeedback>
              <View
                className="bg-card rounded-2xl mx-4" // Changed modal background to semantic card color
                style={{ height: modalHeight }}
              >
                <View className="p-4 border-b border-border">
                  {/* Changed border color to semantic */}
                  <Text className="text-lg font-medium text-foreground text-center">
                    {/* Changed text color to semantic */}
                    Select a Question
                  </Text>
                </View>

                <ScrollView
                  className="flex-1 p-4"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {questions.map((question) => (
                    <TouchableOpacity
                      key={question.value}
                      onPress={() => handleSelect(question)}
                      className={cn(
                        "p-4 border-b border-border", // Changed border color to semantic
                        value?.value === question.value && "bg-accent" // Changed selected question background to semantic
                      )}
                    >
                      <Text className="text-base text-foreground">
                        {question.value}
                      </Text>
                      {/* Changed text color to semantic */}
                    </TouchableOpacity>
                  ))}

                  <View className="mt-4 space-y-2">
                    <Button className="mt-3">
                      <Link href={{ pathname: "/manage-questions" }}>
                        <Text>Manage Default Questions</Text>
                      </Link>
                    </Button>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default QuestionSelector;
