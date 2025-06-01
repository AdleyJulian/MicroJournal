import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
