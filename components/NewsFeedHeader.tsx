import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Sliders } from "@/lib/icons";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text } from "@/components/ui/";
export function NewsFeedHeader({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <ThemedView className="flex-row justify-between items-center">
        <ThemedView>
          <TouchableOpacity
            style={styles.heading}
            onPress={() => setIsOpen((value) => !value)}
            activeOpacity={0.8}
          >
            <IconSymbol
              name="chevron.right"
              size={18}
              weight="medium"
              color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
              style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
            />

            <Text className="font-extrabold text-xl">{title}</Text>
          </TouchableOpacity>
        </ThemedView>

        <Link href={{ pathname: "/manage-feeds" }}>
          <Sliders
            size={24}
            className="text-gray-600 dark:text-gray-300"
            strokeWidth={2}
          />
        </Link>
      </ThemedView>

      {isOpen && <ThemedView>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  content: {
    marginTop: 6,
    marginLeft: 0,
  },
});
