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
import { ChevronDown } from "@/lib/icons";
import { Textarea, Button, Text } from "./ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { Link } from "expo-router";
import { FormLabel } from "~/components/ui/form";

type Question = {
  label: string;
  value: string;
  index: number;
};

export const defaultQuestions: Question[] = [
  {
    label: "🌟 What was the best part of your day?",
    value: "best-part",
    index: 0,
  },
  {
    label: "📍 What interesting place did you visit today?",
    value: "interesting-place",
    index: 1,
  },
  { label: "💼 What did you work on?", value: "work", index: 2 },
  { label: "📚 What did you read/watch?", value: "read-watch", index: 3 },
  { label: "🤝 Did you meet anyone new?", value: "meet-new", index: 4 },
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
        <QuestionSelector
          label={label}
          error={error}
          value={value}
          onChange={onChange}
        />
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
  const [customQuestion, setCustomQuestion] = useState("");
  const windowHeight = Dimensions.get("window").height;
  const modalHeight = windowHeight * 0.7; // Takes up 70% of screen height

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
    await AsyncStorage.setItem("questions", JSON.stringify(defaultQuestions));
    // try {
    //   const storedQuestions = await AsyncStorage.getItem("questions");
    //   if (storedQuestions) {
    //     setQuestions(JSON.parse(storedQuestions));
    //   } else {
    //     setQuestions(defaultQuestions);
    //     await AsyncStorage.setItem(
    //       "questions",
    //       JSON.stringify(defaultQuestions)
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error loading questions:", error);
    //   setQuestions(defaultQuestions);
    // }
  };

  const handleSelect = (question: Question) => {
    onChange(question);
    setIsOpen(false);
  };

  const handleAddCustomQuestion = async () => {
    if (customQuestion.trim()) {
      const newQuestion: Question = {
        label: customQuestion.trim(),
        value: `custom-${Date.now()}`,
        index: questions.length,
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setCustomQuestion("");

      try {
        await AsyncStorage.setItem(
          "questions",
          JSON.stringify(updatedQuestions)
        );
      } catch (error) {
        console.error("Error saving custom question:", error);
      }

      handleSelect(newQuestion);
    }
  };

  return (
    <View className="w-full">
      {label && <FormLabel>{label}</FormLabel>}

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={cn(
          "flex flex-row items-center justify-between p-4 bg-white border rounded-lg",
          error ? "border-red-500" : "border-gray-300",
          "focus:border-blue-500"
        )}
      >
        <Text
          className={cn("text-base", value ? "text-gray-700" : "text-gray-400")}
        >
          {value ? value.label : "Select a question"}
        </Text>
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </TouchableOpacity>

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}

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
                className="bg-white rounded-2xl mx-4"
                style={{ height: modalHeight }}
              >
                <View className="p-4 border-b border-gray-200">
                  <Text className="text-lg font-medium text-center">
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
                        "p-4 border-b border-gray-100",
                        value?.value === question.value && "bg-blue-50"
                      )}
                    >
                      <Text className="text-base">{question.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <View className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Add a custom question..."
                      value={customQuestion}
                      onChangeText={setCustomQuestion}
                      className="min-h-[100]"
                    />

                    <Button
                      onPress={handleAddCustomQuestion}
                      disabled={!customQuestion.trim()}
                      className="mt-3"
                    >
                      <Text className="text-center font-medium">
                        Add Custom Question
                      </Text>
                    </Button>
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
