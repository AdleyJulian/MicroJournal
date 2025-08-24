import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";

type Theme = "light" | "dark";

export function useThemePersistence() {
  const { colorScheme, setColorScheme } = useNativewindColorScheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Load saved theme on app start
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          console.log("Loading saved theme:", savedTheme);
          setColorScheme(savedTheme);
          setAndroidNavigationBar(savedTheme);
        }
      } catch (error) {
        console.error("Error loading saved theme:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadSavedTheme();
  }, [setColorScheme]);

  const setTheme = async (theme: Theme) => {
    try {
      await AsyncStorage.setItem("theme", theme);
      setColorScheme(theme);
      setAndroidNavigationBar(theme);
      console.log("Theme saved and set to:", theme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    isThemeLoaded,
    setTheme,
    toggleTheme,
  };
}
