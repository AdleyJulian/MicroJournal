import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Textarea } from "./ui/textarea";

// Type definitions
interface QuestionItem {
  id: string;
  label: string;
}

interface SelectCustomProps {
  placeholder: string;
  selectedItem: QuestionItem | null;
  onSelectedItemChange: (item: QuestionItem | null) => void;
}

export const SelectCustom: React.FC<SelectCustomProps> = ({
  placeholder,
  selectedItem,
  onSelectedItemChange,
}) => {
  // Refs and State
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [isEditing, setIsEditing] = useState<QuestionItem | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [tempQuestionText, setTempQuestionText] = useState("");

  // Default items if no items exist
  const defaultItems: QuestionItem[] = useMemo(
    () => [
      { id: "best-part", label: "What was the best part of your day?" },
      {
        id: "interesting-place",
        label: "What interesting place did you visit today?",
      },
      { id: "work", label: "What did you work on?" },
      { id: "read-watch", label: "What did you read/watch?" },
    ],
    []
  );

  // Snap points as a constant to avoid re-creation
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // Load items from AsyncStorage
  const loadItems = useCallback(async () => {
    try {
      const storedItems = await AsyncStorage.getItem("journalQuestions");
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setItems(parsedItems.length > 0 ? parsedItems : defaultItems);
      } else {
        setItems(defaultItems);
        await AsyncStorage.setItem(
          "journalQuestions",
          JSON.stringify(defaultItems)
        );
      }
    } catch (error) {
      console.error("Error loading items:", error);
      setItems(defaultItems);
    }
  }, [defaultItems]);

  // Save items to AsyncStorage
  const saveItems = useCallback(async (updatedItems: QuestionItem[]) => {
    try {
      await AsyncStorage.setItem(
        "journalQuestions",
        JSON.stringify(updatedItems)
      );
      setItems(updatedItems);
    } catch (error) {
      console.error("Error saving items:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Handle item selection
  const handleItemPress = (item: QuestionItem) => {
    onSelectedItemChange(item);
    bottomSheetRef.current?.close();
  };

  // Add new question
  const handleAddQuestion = () => {
    if (newQuestionText.trim()) {
      const newQuestion: QuestionItem = {
        id: `custom-${Date.now()}`,
        label: newQuestionText.trim(),
      };
      const updatedItems = [...items, newQuestion];
      saveItems(updatedItems);
      setNewQuestionText("");
    }
  };

  // Edit existing question
  const handleEditQuestion = () => {
    if (isEditing && newQuestionText.trim()) {
      const updatedItems = items.map((item) =>
        item.id === isEditing.id
          ? { ...item, label: newQuestionText.trim() }
          : item
      );
      saveItems(updatedItems);
      setIsEditing(null);
      setNewQuestionText("");
    }
  };

  // Delete question
  const handleDeleteQuestion = (itemToDelete: QuestionItem) => {
    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedItems = items.filter(
              (item) => item.id !== itemToDelete.id
            );
            saveItems(updatedItems);
          },
        },
      ]
    );
  };

  // Open bottom sheet
  const handleOpenPress = () => bottomSheetRef.current?.present();

  // Close bottom sheet
  const handleClosePress = () => bottomSheetRef.current?.dismiss();

  return (
    <>
      <Button onPress={handleOpenPress} className="mt-2">
        <Text>{selectedItem?.label || placeholder}</Text>
      </Button>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="p-4">
            {/* Question List */}
            {items.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between mb-2"
              >
                <Button
                  className="flex-1 mr-2"
                  onPress={() => handleItemPress(item)}
                >
                  <Text>{item.label}</Text>
                </Button>

                {/* Edit and Delete Buttons */}
                <Button
                  className="mr-2"
                  onPress={() => {
                    setIsEditing(item);
                    setNewQuestionText(item.label);
                  }}
                >
                  <Text>Edit</Text>
                </Button>

                <Button onPress={() => handleDeleteQuestion(item)}>
                  <Text>Delete</Text>
                </Button>
              </View>
            ))}

            {/* Add/Edit Question Input */}
            <View className="mt-4 flex-row items-center">
              <BottomSheetTextInput
                className="flex-1 border p-2 mr-2"
                value={tempQuestionText}
                onChangeText={(text) => {
                  // Wrap state update in requestAnimationFrame to avoid render-time value reading
                  requestAnimationFrame(() => {
                    setTempQuestionText(text);
                  });
                }}
                placeholder={isEditing ? "Edit question" : "Add new question"}
              />
              <Button
                onPress={isEditing ? handleEditQuestion : handleAddQuestion}
              >
                <Text>{isEditing ? "Update" : "Add"}</Text>
              </Button>
            </View>

            <Button onPress={handleClosePress} className="mt-4">
              <Text>Close</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    </>
  );
};
