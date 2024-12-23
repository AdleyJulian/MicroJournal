import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { NewCardForm } from "@/components/form/NewCard";

interface CreateMemoryScreenProps {
  onSaveMemory: (memory: MemoryEntry) => void;
}

interface MemoryEntry {
  date: Date;
  memories: string[];
  places: string[];
  experiences: string[];
  work: string[];
  books: string[];
  movies: string[];
}

const CreateMemoryScreen: React.FC<CreateMemoryScreenProps> = ({
  onSaveMemory,
}) => {
  const [currentMemory, setCurrentMemory] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [workNotes, setWorkNotes] = useState("");
  const [books, setBooks] = useState<string[]>([]);
  const [movies, setMovies] = useState<string[]>([]);

  const addChipItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    currentValue: string,
    items: string[]
  ) => {
    if (currentValue.trim() && !items.includes(currentValue.trim())) {
      setter([...items, currentValue.trim()]);
    }
  };

  const removeChipItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    itemToRemove: string,
    items: string[]
  ) => {
    setter(items.filter((item) => item !== itemToRemove));
  };

  const handleSaveMemory = () => {
    const newMemory: MemoryEntry = {
      date: new Date(),
      memories: currentMemory ? [currentMemory] : [],
      places,
      experiences,
      work: workNotes ? [workNotes] : [],
      books,
      movies,
    };

    onSaveMemory(newMemory);
    // Reset form
    setCurrentMemory("");
    setPlaces([]);
    setExperiences([]);
    setWorkNotes("");
    setBooks([]);
    setMovies([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="px-4 py-6">
        <NewCardForm ArticleData={null} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateMemoryScreen;
