import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormTextarea,
  FormDatePicker,
} from "../ui/form";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FormQuestionSelector } from "@/components/QuestionSelector";
import { ArticleData } from "@/db/schema/types";
import { type JournalEntryContent } from "@/db/schema/types";
import { newEntry } from "@/db/mutations";
import Toast from "react-native-toast-message";

const questions = [
  { label: "What was the best part of your day?", value: "best-part" },
  {
    label: "What interesting place did you visit today?",
    value: "interesting-place",
  },
  { label: "What did you work on?", value: "work" },
  { label: "What did you read/watch?", value: "read-watch" },
  { label: "Did you meet anyone new?", value: "meet-new" },
];
type ArticleObject = { ArticleData: ArticleData };

const showToast = () => {
  Toast.show({
    type: "success",
    text1: "Saved",
    text2: "Memory Saved Successfully",
    visibilityTime: 2000,
    autoHide: true,
    onPress() {
      Toast.hide();
    },
    position: "bottom",
    bottomOffset: 80,
  });
};

export const NewCardForm: React.FC<ArticleObject> = (props) => {
  const formSchema = z.object({
    promptQuestion: z.object({ label: z.string(), value: z.string() }),
    // selectQuestion: z.object({ label: z.string(), value: z.string() }),
    answer: z.string().min(1, "This field is required").max(500, "Too long"),
    image: z.string().optional(),
    date: z.string().optional(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptQuestion: { label: "", value: "" },
      answer: "",
    },
  });

  const handleSubmit = async () => {
    console.log("Form submitted", form.getValues());
    // Validate inputs
    try {
      // Prepare the card data
      const cardData: JournalEntryContent = {
        tags: [],
        article: null,
        promptQuestion: form.getValues("promptQuestion").label,
        answer: form.getValues("answer"),
      };

      // Insert the card into the database
      await newEntry(cardData);

      // Show a success toast
      showToast();

      // Reset form and clear errors
      form.reset();

      // Optional: Add navigation or success feedback
      // navigation.goBack() or show a success toast
    } catch (error) {
      console.error("Failed to create card", error);
      // Optional: Show an error toast
    }
  };
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Form {...form}>
      <View>
        <Text className="my-2 text-4xl font-bold">Create a new memory!</Text>
        {/* Date of the new card */}
        {/* <View className="m-2">
          <Text> December 14, 2024</Text>
        </View> */}
      </View>

      <Card className="p-2 justify-normal">
        <FormItem className="mb-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormDatePicker
                label="Date of the memory"
                {...field}
                value={field.value || new Date().toDateString()}
                initialDate={new Date().toDateString()}
              />
            )}
          />
        </FormItem>

        <FormItem className="mb-2">
          <FormQuestionSelector
            name="promptQuestion"
            control={form.control}
            label="Card Question"
            rules={{ required: "Please select a question" }}
          />
        </FormItem>
        <FormItem className="mb-2">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormTextarea
                label="What do you want to remember?"
                placeholder="Enter your memory"
                // description="This is the answer that will be displayed on the card."
                {...field}
                numberOfLines={5}
                autoCorrect={true}
              />
            )}
          />
        </FormItem>
      </Card>
      <Button
        onPress={form.handleSubmit(handleSubmit)}
        className="mt-4 to-blue-600"
        disabled={!form.formState.isValid}
      >
        <Text>Save your memory</Text>
      </Button>
      <Button onPress={() => form.reset()} className="mt-2">
        <Text>Clear</Text>
      </Button>
    </Form>
  );
};

export default NewCardForm;
