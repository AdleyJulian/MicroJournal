import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link } from "expo-router";
import {
  Form,
  FormField,
  FormItem,
  FormTextarea,
  FormDatePicker,
  FormImageSelector,
} from "../ui/form";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FormQuestionSelector } from "@/components/QuestionSelector";
import { ArticleData } from "@/db/schema/types";
import { type JournalEntryContent } from "@/db/schema/types";
import { newEntry } from "@/db/mutations";
import { router } from "expo-router";

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
type ArticleObject = { articleData: ArticleData };

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
  const { articleData } = props;
  const formSchema = z.object({
    promptQuestion: z.object({
      index: z.number(),
      value: z.string().min(1, "This field is required").max(500, "Too long"),
    }),
    answer: z.string().min(1, "This field is required").max(500, "Too long"),
    date: z.string().optional(),
    media: z
      .object({
        mediaPath: z.string().optional(),
        mediaSourceType: z.enum(["url", "file"]).optional(),
      })
      .optional(),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptQuestion: { index: 0, value: "" },
      answer: "",
      media: undefined,
    },
    values: {
      promptQuestion: articleData
        ? { value: "📰 What what the news headline for the day?", index: -1 }
        : { index: 0, value: "" },

      answer: articleData?.title || "",
      media: { mediaPath: articleData?.image, mediaSourceType: "url" },
    },
    context: { articleData },
  });

  const handleSubmit = async () => {
    // Validate inputs
    try {
      // Prepare the card data
      const cardData: JournalEntryContent = {
        tags: [],
        article: null,
        promptQuestion: form.getValues("promptQuestion").value,
        answer: form.getValues("answer"),
        mediaPath: form.getValues("media")?.mediaPath,
        mediaSourceType: form.getValues("media")?.mediaSourceType,
        entryDate: new Date(form.getValues("date") || Date.now()).getTime(),
      };

      // Insert the card into the database

      console.log("Card data to be inserted:", cardData);
      await newEntry(cardData);

      // Show a success toast
      showToast();

      // Reset form and clear errors
      //Need to fix this, since the reset no longer resets the query params
      router.setParams({ articleData: null });
      form.reset();
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
        <Text className="my-2 text-4xl text-primary font-extrabold tracking-tight">
          Create a new memory!
        </Text>
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
                {...field}
                placeholderTextColor="#9CA3AF" // Bug in NativeWind, using inline style for now
                numberOfLines={5}
                autoCorrect={true}
              />
            )}
          />
        </FormItem>
        <FormField
          control={form.control}
          name="media"
          // No required rule
          render={({ field }) => (
            <FormImageSelector
              label="Image"
              description="Select a related image (optional)"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      </Card>
      <Button
        onPress={form.handleSubmit(handleSubmit)}
        className="mt-4 to-blue-600"
        disabled={!form.formState.isValid}
      >
        <Text>Save your memory</Text>
      </Button>
      <Link asChild href={{ pathname: "/(tabs)/create" }}>
        <Button className="mt-2" onPress={() => form.reset()}>
          <Text>Clear</Text>
        </Button>
      </Link>
    </Form>
  );
};

export default NewCardForm;
