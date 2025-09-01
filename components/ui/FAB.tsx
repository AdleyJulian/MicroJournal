import React from "react";
import { Pressable, ViewStyle, StyleSheet, Platform, View  } from "react-native";
import { cn } from "@/lib/utils";

type FABProps = {
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  accessibilityLabel?: string;
  testID?: string;
  inline?: boolean;
};

export function FAB({
  onPress,
  children,
  style,
  className,
  accessibilityLabel = "Floating Action Button",
  testID,
  inline = false,
}: FABProps) {
  return (

    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      testID={testID}
      style={[style, styles.shadow]}
      className={cn(
        "h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg",
        !inline && "absolute bottom-6 right-6",
        className
      )}
    >
      {children}
    </Pressable>

  );
}

const styles = StyleSheet.create({

    shadow: {
        shadowColor: 'black',
        elevation: 5,
      }
  });

