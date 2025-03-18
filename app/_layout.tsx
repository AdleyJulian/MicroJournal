import "~/global.css";

import "expo-dev-client";

// import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { DatabaseProvider } from "~/db/provider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { RSSFeedConfigProvider } from "@/contexts/RSSFeedConfigContext"; // Import your config provider
import { RSSFeedProvider } from "@/contexts/RSSFeedContext"; // Import your feed provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";

const queryClient = new QueryClient();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
    console.log("Color scheme loaded");
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }
  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <DatabaseProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <RSSFeedConfigProvider>
                <RSSFeedProvider
                  initialRssFeeds={[]}
                  initialOptions={{
                    limit: 100,
                    refreshInterval: 5 * 60 * 1000, // 5 minutes
                    cacheTimeout: 30, // 30 minutes
                  }}
                >
                  <Stack>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                    {/* <Stack.Screen
                name="manage-feeds"
                options={{ title: "Manage Feeds" }}
              /> */}
                    <Stack.Screen
                      name="manage-questions"
                      options={{ title: "Manage Questions" }}
                    />
                    <Stack.Screen
                      name="entries/index"
                      options={{ title: "Entry", headerShown: false }}
                    />
                    <Stack.Screen
                      name="settings"
                      options={{ title: "Settings", headerShown: true }}
                    />
                  </Stack>
                  <PortalHost />
                </RSSFeedProvider>
              </RSSFeedConfigProvider>

              <Toast />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

// const useIsomorphicLayoutEffect =
//   Platform.OS === "web" && typeof window === "undefined"
//     ? React.useEffect
//     : React.useLayoutEffect;
