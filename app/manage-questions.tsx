import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronLeft, GripVertical, X, Edit2, Plus, Save } from "~/lib/icons";
import { Text } from "~/components/ui";
import { useFocusEffect } from "expo-router";

export type Question = {
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

const ManageQuestionsScreen = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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
    //   const stored = await AsyncStorage.getItem("questions");
    //   if (stored) {
    //     const parsedQuestions = JSON.parse(stored);
    //     if (parsedQuestions.length === 0) {
    //       setQuestions(defaultQuestions);
    //       await AsyncStorage.setItem(
    //         "questions",
    //         JSON.stringify(defaultQuestions)
    //       );
    //     } else {
    //       setQuestions(parsedQuestions);
    //     }
    //   } else {
    //     setQuestions(defaultQuestions);
    //   }
    // } catch (error) {
    //   console.error("Error loading questions:", error);
    // }
  };

  const saveQuestions = async (updatedQuestions: Question[]) => {
    try {
      // Convert back to the original format for compatibility
      const convertedQuestions = updatedQuestions.map((q) => ({
        label: q.label,
        value: q.value,
        index: q.index,
      }));
      await AsyncStorage.setItem(
        "questions",
        JSON.stringify(convertedQuestions)
      );
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const newQuestionItem: Question = {
        label: `question-${Date.now()}`,
        value: newQuestion.trim(),
        index: questions.length,
      };
      const updatedQuestions = [...questions, newQuestionItem];
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      setNewQuestion("");
    }
  };

  const handleDeleteQuestion = (id: string) => {
    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedQuestions = questions.filter((q) => q.label !== id);
            setQuestions(updatedQuestions);
            saveQuestions(updatedQuestions);
          },
        },
      ]
    );
  };

  const handleEditStart = (question: Question) => {
    setEditingId(question.label);
    setEditText(question.value);
  };

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      const updatedQuestions = questions.map((q) =>
        q.label === id ? { ...q, value: editText.trim() } : q
      );
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      setEditingId(null);
      setEditText("");
    }
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Question>) => {
      const isEditing = item.label === editingId;

      return (
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            className={`bg-white border border-gray-200 rounded-lg mb-2 ${
              isActive ? "shadow-md" : ""
            }`}
          >
            <View className="flex-row items-center p-4 gap-3">
              <TouchableOpacity onLongPress={drag}>
                <GripVertical size={20} color="#9ca3af" />
              </TouchableOpacity>

              <View className="flex-1">
                {isEditing ? (
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      value={editText}
                      onChangeText={setEditText}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={() => handleEditSave(item.label)}
                      className="bg-blue-500 rounded-lg px-3 py-2"
                    >
                      <Text className="text-white">Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text className="text-gray-700">{item.value}</Text>
                )}
              </View>

              {!isEditing && (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleEditStart(item)}
                    className="p-2"
                  >
                    <Edit2 size={20} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteQuestion(item.label)}
                    className="p-2"
                  >
                    <X size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    [editingId, editText]
  );

  const handleDragEnd = useCallback(({ data }: { data: Question[] }) => {
    setQuestions(data);
    saveQuestions(data);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}

      {/* Question List */}
      <DraggableFlatList
        data={questions}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.label}
        renderItem={renderItem}
        contentContainerClassName="p-4"
      />

      {/* Add New Question */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="border-t border-gray-200 bg-white"
      >
        <View className="p-4">
          <View className="flex-row gap-2">
            <TextInput
              value={newQuestion}
              onChangeText={setNewQuestion}
              placeholder="Add a new question..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <TouchableOpacity
              onPress={handleAddQuestion}
              disabled={!newQuestion.trim()}
              className={`px-4 py-2 rounded-lg flex-row items-center ${
                newQuestion.trim() ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <Plus size={20} color="white" />
              <Text className="text-white ml-2">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ManageQuestionsScreen;
