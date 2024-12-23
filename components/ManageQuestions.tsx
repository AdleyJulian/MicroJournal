import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "~/components/ui";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GripVertical, X, Edit2, Save, Plus } from "~/lib/icons";
// import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";
import { defaultQuestions, type Question } from "@/app/manage-questions";
import { set } from "react-hook-form";

export const ManageQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadQuestions();
    }, [])
  );

  const loadQuestions = async () => {
    setQuestions(defaultQuestions);
    await AsyncStorage.setItem("questions", JSON.stringify(defaultQuestions));
    // try {
    //   const storedQuestions = await AsyncStorage.getItem("questions");
    //   setQuestions(defaultQuestions);
    //   await AsyncStorage.setItem("questions", JSON.stringify(defaultQuestions));

    //   if (storedQuestions) {
    //     if (storedQuestions.length === 0) setQuestions(defaultQuestions);
    //     else setQuestions(JSON.parse(storedQuestions));
    //     setQuestions(JSON.parse(storedQuestions));
    //   } else {
    //     setQuestions(defaultQuestions);
    //   }
    // } catch (error) {
    //   console.error("Error loading questions:", error);
    // }
  };

  const saveQuestions = async (updatedQuestions: Question[]) => {
    try {
      await AsyncStorage.setItem("questions", JSON.stringify(updatedQuestions));
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const newQuestionItem: Question = {
        label: newQuestion.trim(),
        value: `custom-${Date.now()}`,
        index: questions.length,
      };
      saveQuestions([...questions, newQuestionItem]);
      setNewQuestion("");
    }
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditedText(questions[index].label);
  };

  const handleEditSave = () => {
    if (editingIndex !== null && editedText.trim()) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = {
        ...updatedQuestions[editingIndex],
        label: editedText.trim(),
      };
      saveQuestions(updatedQuestions);
      setEditingIndex(null);
      setEditedText("");
    }
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      "Delete Question",
      "Are you sure you want to delete this question?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            saveQuestions(updatedQuestions);
          },
        },
      ]
    );
  };

  const QuestionItem = ({ item, index }: { item: Question; index: number }) => {
    const isEditing = editingIndex === index;

    return (
      <View className="flex-row items-center p-4">
        <GripVertical size={20} color="#9ca3af" className="mr-3" />

        {isEditing ? (
          <View className="flex-1 flex-row items-center">
            <TextInput
              value={editedText}
              onChangeText={setEditedText}
              className="flex-1 text-base py-2 px-3 border border-gray-300 rounded-lg mr-2"
              autoFocus
            />
            <TouchableOpacity onPress={handleEditSave} className="p-2">
              <Save size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 flex-row items-center justify-between">
            <Text className="text-base flex-1">{item.label}</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => handleEditStart(index)}
                className="p-2"
              >
                <Edit2 size={20} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(index)}
                className="p-2"
              >
                <X size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* <DraggableFlatList
        data={questions}
        renderItem={({ item, drag, isActive }) => (
          <QuestionItem item={item} index={item.index} />
        )}
        keyExtractor={(item) => item.index.toString()}
        onDragBegin={(index) => setDraggingIndex(index)}
        onDragEnd={() => setDraggingIndex(null)}
      /> */}
      {questions.map((item, index) => (
        <QuestionItem item={item} index={index} key={index} />
      ))}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center space-x-2">
          <TextInput
            value={newQuestion}
            onChangeText={setNewQuestion}
            placeholder="Add a new question..."
            className="flex-1 text-base py-2 px-3 border border-gray-300 rounded-lg"
          />
          <TouchableOpacity
            onPress={handleAddQuestion}
            disabled={!newQuestion.trim()}
            className={`p-3 rounded-lg ${
              newQuestion.trim() ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
