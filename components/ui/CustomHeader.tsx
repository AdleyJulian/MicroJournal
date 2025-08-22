import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function CustomHeader({ title, showBackButton = true }: CustomHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Debug logging to see what insets we're getting
  React.useEffect(() => {
    console.log('CustomHeader insets:', insets);
  }, [insets]);

  const handleBack = () => {
    router.back();
  };

  return (
    <View
      className="bg-background border-b border-border"
      style={{
        paddingTop: insets.top,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          android: {
            elevation: 2,
          },
        }),
      }}
    >
      <View className="flex-row items-center px-4 min-h-[44px]">
        {showBackButton && (
          <Pressable
            onPress={handleBack}
            className="mr-4 p-2 rounded-lg"
            hitSlop={8}
          >
            <ChevronLeft size={24} className="text-foreground" />
          </Pressable>
        )}
        <Text
          className={`text-foreground text-lg font-semibold flex-1 ${
            showBackButton ? 'text-left' : 'text-center'
          }`}
        >
          {title}
        </Text>
        {showBackButton && <View className="w-10" />}
      </View>
    </View>
  );
}
