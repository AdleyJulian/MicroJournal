import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol, type IconSymbolName } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  type TabIconProps = {
    icon: IconSymbolName;
    name: string;
    color: string;
    focused: boolean;
  };
  const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
    return (
      <View className="flex items-center justify-center gap-2">
        <IconSymbol size={28} name={icon} color={color} />
        {focused && <View style={{ height: 2, backgroundColor: color }} />}
        <Text
          className={`${focused ? "font-bold" : "font-normal"}`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "Review",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="arrow.clockwise" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.fill" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore/index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar.circle.fill" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="newspaper.circle.fill" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
