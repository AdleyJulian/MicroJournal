import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

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

import { useMutation, useQuery } from "@tanstack/react-query";

import { FormQuestionSelector } from "@/components/QuestionSelector";

import { type JournalEntry, type MediaAttachment } from "@/db/schema/schema";
import { type JournalEntryUpdate } from "@/db/schema/types";
import { updateEntryWithMedia } from "@/db/mutations";

import { router } from "expo-router";

import Toast from "react-native-toast-message";
import { getEntryById } from "@/db/queries";

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

type props = {
  data: {
    journal_cards: JournalEntry;
    media_attachments: MediaAttachment | null;
  };
};
export const EditCardForm: React.FC<props> = (props) => {
  const { journal_cards, media_attachments } = props.data;
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

  type MediaSourceType = "url" | "file";
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    values: {
      promptQuestion: { index: 0, value: journal_cards.promptQuestion || "" },
      answer: journal_cards.answer || "",
      media: {
        mediaPath: media_attachments?.mediaPath,
        mediaSourceType: media_attachments?.mediaSourceType as MediaSourceType,
      },
      date: journal_cards.entryDate.toISOString().split("T")[0],
    },
  });
  const { mutateAsync: update } = useMutation({
    mutationFn: updateEntryWithMedia,
    onSuccess: () => {
      showToast();
      router.back();
      refetch();
    },
  });

  const { refetch } = useQuery({
    queryKey: ["getEntryById", journal_cards.id],
    queryFn: () => getEntryById(journal_cards.id),
  });

  const handleSubmit = async () => {
    // Validate inputs

    const cardData: JournalEntryUpdate = {
      id: journal_cards.id.toString(),
      tags: [],
      article: null,
      promptQuestion: form.getValues("promptQuestion").value,
      answer: form.getValues("answer"),
      mediaPath: form.getValues("media")?.mediaPath,
      mediaSourceType: form.getValues("media")?.mediaSourceType,
      entryDate: new Date(form.getValues("date") || Date.now()).getTime(),
    };

    await update(cardData);
  };

  return (
    <Form {...form}>
      <Card className="p-2 justify-normal">
        <FormItem className="mb-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormDatePicker
                label="Date of the memory"
                {...field}
                value={field.value || new Date().toISOString().split("T")[0]}
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

      <Button
        className="mt-2"
        onPress={() => {
          form.setValue("promptQuestion", { index: 0, value: "" });
          form.setValue("answer", "");
          form.setValue("media", {});
          form.setValue("date", new Date().toISOString().split("T")[0]);
        }}
      >
        <Text>Clear</Text>
      </Button>
      <Button
        className="mt-2"
        onPress={() => {
          // You might want to add a confirmation dialog here
          router.back();
        }}
      >
        <Text>Discard Changes</Text>
      </Button>
    </Form>
  );
};

export default EditCardForm;
