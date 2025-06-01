import React, { useState, useEffect } from "react";
import { ScrollView, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImportButton, ExportButton } from "@/components/SettingsComponents";

import {
  Card,
  CardContent,
  CardHeader,
  Text,
  ThemeToggle,
  Separator,
  CardFooter,
} from "@/components/ui";


const Settings: React.FC = () => {
  const [isDefaultCardsEnabled, setIsDefaultCardsEnabled] = useState(true);

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const value = await AsyncStorage.getItem("defaultCardsSetting");
        if (value !== null) {
          setIsDefaultCardsEnabled(JSON.parse(value));
        }
      } catch (error) {
        console.error("Failed to load default cards setting.", error);
      }
    };
    loadSetting();
  }, []);

  const toggleDefaultCardsSetting = async () => {
    try {
      const newValue = !isDefaultCardsEnabled;
      setIsDefaultCardsEnabled(newValue);
      await AsyncStorage.setItem("defaultCardsSetting", JSON.stringify(newValue));
    } catch (error) {
      console.error("Failed to save default cards setting.", error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="bg-background">
        <Card className="m-2 p-2">
          <CardHeader>
            <Text className="text-lg font-semibold">Settings</Text>
          </CardHeader>
          <CardContent>
            <View className="flex-row justify-between items-center">
              <Text>Light Mode</Text>
              <ThemeToggle />
            </View>
            <Separator className="my-4" />
            <View className="flex-1 gap-4 m-4">
              <ImportButton />
              <ExportButton />
            </View>
            <Separator className="my-4" />
            <View className="mb-4">
              <Text className="text-md font-semibold mb-2">Default Cards</Text>
              <View className="flex-row justify-between items-center">
                <Text>Enable Daily 'Day of the Week' Card</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isDefaultCardsEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDefaultCardsSetting}
                  value={isDefaultCardsEnabled}
                />
              </View>
            </View>
            <CardFooter>
              <Text> Version 1.0.0</Text>
            </CardFooter>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
