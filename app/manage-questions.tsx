import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
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
import { Button, Text,   CustomHeader, } from "~/components/ui";
import { useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  shadowEffect: {
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow property
    elevation: 5,
  },
});

export type Question = {
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
  };

  const saveQuestions = async (updatedQuestions: Question[]) => {
    try {
      // Convert back to the original format for compatibility
      const convertedQuestions = updatedQuestions.map((q) => ({
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
        value: newQuestion,
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
            const updatedQuestions = questions.filter((q) => q.value !== id);
            setQuestions(updatedQuestions);
            saveQuestions(updatedQuestions);
          },
        },
      ]
    );
  };

  const handleEditStart = (question: Question) => {
    setEditingId(question.value);
    setEditText(question.value);
  };

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      const updatedQuestions = questions.map((q) =>
        q.value === id ? { ...q, value: editText.trim() } : q
      );
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      setEditingId(null);
      setEditText("");
    }
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Question>) => {
      const isEditing = item.value === editingId;

      return (
        
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            className="bg-card border border-border rounded-lg mb-2"
            style={[isActive && styles.shadowEffect]}
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
                      onPress={() => handleEditSave(item.value)}
                      className="bg-primary rounded-lg px-3 py-2"
                    >
                      <Text className="text-primary-foreground">Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text className="text-foreground">{item.value}</Text>
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
                    onPress={() => handleDeleteQuestion(item.value)}
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
    setQuestions(data.map((item) => ({ ...item })));
    saveQuestions(data.map((item) => ({ ...item })));
  }, []);

  return (
    <View className="flex-1 bg-background">
      <CustomHeader title="Manage Questions" showBackButton={true} />

      {/* Add New Question Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="bg-background"
      >
        <View className="p-4 border-b border-border">
          <View className="flex-row gap-2">
            <TextInput
              value={newQuestion}
              onChangeText={setNewQuestion}
              placeholder="Add a new question..."
              className="flex-1 border border-input rounded-lg px-4 py-2 text-foreground"
              placeholderTextColor={"#9ca3af"}
            />
            <Button
              onPress={handleAddQuestion}
              disabled={!newQuestion.trim()}
              className={`px-4 py-2 rounded-lg flex-row items-center`}
            >
              <Plus size={20} color="white" />
              <Text className="ml-2 text-primary-foreground">Add</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Question List */}
      <DraggableFlatList
        data={questions}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.value}
        renderItem={renderItem}
        contentContainerClassName="p-4"
      />

      {/* Add New Question */}
    </View>
  );
};
export default ManageQuestionsScreen;
