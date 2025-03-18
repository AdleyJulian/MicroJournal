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
import { Trash2, Edit2 } from "@/lib/icons";
import { Link, router } from "expo-router";
import { Text } from "@/components/ui";
import { useMutation } from "@tanstack/react-query";
import * as mutations from "@/db/mutations";

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
  isLoading?: boolean;
}

export function EntryActions({ entryId, isLoading }: EntryActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
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

  return (
    <CardFooter className="flex-row justify-end space-x-2 mt-4">
      <Link asChild href={{ pathname: "/edit", params: { id: entryId } }}>
        <Button
          variant="outline"
          className="flex-row items-center space-x-2"
          onPress={() => console.log("Edit entry", entryId)}
          disabled={isLoading}
        >
          <Edit2 className="w-4 h-4 mr-2 text-foreground" />
          <Text>Edit</Text>
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="flex-row items-center space-x-2 m-2"
            disabled={isLoading || isDeleting}
          >
            <Trash2 className="w-4 h-4 text-white mr-2" />
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
