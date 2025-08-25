import React, { useState } from "react";
import { CardFooter, Button } from "@/components/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit2, Share2 } from "@/lib/icons";
import { Link, router } from "expo-router";
import { Text } from "@/components/ui";
import { useMutation } from "@tanstack/react-query";
import * as mutations from "@/db/mutations";
import { shareEntryWithImage, shareTextOnly } from "@/lib/shareUtils";
import { type JournalEntry, type MediaAttachment } from "@/db/schema/schema";

import Toast from "react-native-toast-message";

const showToast = () => {
  Toast.show({
    type: "success",
    text1: "Saved",
    text2: "Memory Deleted Successfully",
    visibilityTime: 2000,
    autoHide: true,
    onPress() {
      Toast.hide();
    },
    position: "bottom",
    bottomOffset: 80,
  });
};

interface EntryActionsProps {
  entryId: string;
  entry?: JournalEntry;
  media?: MediaAttachment | null;
  isLoading?: boolean;
}

export function EntryActions({ entryId, entry, media, isLoading }: EntryActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const { mutate: deleteEntry } = useMutation({
    mutationFn: (entryId: number) => mutations.deleteEntry(entryId),
    onSuccess: () => {
      showToast();
      router.back();
    },
  });

  const handleDelete = async () => {
    await deleteEntry(parseInt(entryId));
  };

  const handleShare = async () => {
    if (!entry) return;

    setIsSharing(true);
    try {
      await shareEntryWithImage(entry, media || null);
      // Show success toast
      Toast.show({
        type: "success",
        text1: "Shared Successfully",
        text2: "Memory shared via native sharing",
        visibilityTime: 2000,
        autoHide: true,
        position: "bottom",
        bottomOffset: 80,
      });
    } catch (error) {
      console.error('Share failed:', error);
      // Show error toast
      Toast.show({
        type: "error",
        text1: "Share Failed",
        text2: "Unable to share this memory",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
        bottomOffset: 80,
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <CardFooter className="flex-row justify-around gap-3 mt-6 px-1">
      <Button
        variant="outline"
        className="flex-row items-center gap-2 px-4 py-2"
        onPress={handleShare}
        disabled={isLoading || isSharing || !entry}
      >
        <Share2 className="w-4 h-4 text-foreground" />
        <Text>{isSharing ? "Sharing..." : "Share"}</Text>
      </Button>

      <Link asChild href={{ pathname: "/edit", params: { id: entryId } }}>
        <Button
          variant="outline"
          className="flex-row items-center gap-2 px-4 py-2"
          onPress={() => console.log("Edit entry", entryId)}
          disabled={isLoading}
        >
          <Edit2 className="w-4 h-4 text-foreground" />
          <Text>Edit</Text>
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="flex-row items-center gap-2 px-4 py-2"
            disabled={isLoading || isDeleting}
          >
            <Trash2 className="w-4 h-4 text-white" />
            <Text>{isDeleting ? "Deleting..." : "Delete"}</Text>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this memory? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onPress={handleDelete}
            >
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardFooter>
  );
}
