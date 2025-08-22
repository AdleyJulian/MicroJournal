import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "./text";
import { Input } from "./input";

interface CustomReviewSectionProps {
  daysAhead: number;
  onDaysChange: (days: number) => void;
  forgottenDays: number;
  onForgottenDaysChange: (days: number) => void;
  disabled?: boolean;
}

export const CustomReviewSection = ({
  daysAhead,
  onDaysChange,
  forgottenDays,
  onForgottenDaysChange,
  disabled = false,
}: CustomReviewSectionProps) => {
  const [inputValue, setInputValue] = useState(daysAhead.toString());
  const [forgottenInputValue, setForgottenInputValue] = useState(forgottenDays.toString());

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 0 && num <= 365) {
      onDaysChange(num);
    }
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 0) {
      setInputValue("0");
      onDaysChange(0);
    } else if (num > 365) {
      setInputValue("365");
      onDaysChange(365);
    }
  };

  const handleForgottenInputChange = (text: string) => {
    setForgottenInputValue(text);
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 0 && num <= 365) {
      onForgottenDaysChange(num);
    }
  };

  const handleForgottenInputBlur = () => {
    const num = parseInt(forgottenInputValue, 10);
    if (isNaN(num) || num < 0) {
      setForgottenInputValue("0");
      onForgottenDaysChange(0);
    } else if (num > 365) {
      setForgottenInputValue("365");
      onForgottenDaysChange(365);
    }
  };

  return (
    <View className="p-4 bg-gray-50 rounded-lg">
      <View className="mb-3">
        <Text className="text-base font-medium text-gray-900">
          Custom Review
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Customize your review session with additional options
        </Text>
      </View>

      {/* Review Ahead Section */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900">
            Review Ahead
          </Text>
          <Text className="text-xs text-gray-600 mt-1">
            Include cards scheduled for review in the next {daysAhead} day{daysAhead !== 1 ? 's' : ''}
          </Text>
        </View>
        <View className="w-20 ml-3">
          <Input
            value={inputValue}
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            keyboardType="numeric"
            placeholder="0"
            disabled={disabled}
            className="text-center"
          />
        </View>
      </View>

      {/* Review Forgotten Cards Section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900">
            Review Forgotten Cards
          </Text>
          <Text className="text-xs text-gray-600 mt-1">
            Include cards forgotten in the last {forgottenDays} day{forgottenDays !== 1 ? 's' : ''}
          </Text>
        </View>
        <View className="w-20 ml-3">
          <Input
            value={forgottenInputValue}
            onChangeText={handleForgottenInputChange}
            onBlur={handleForgottenInputBlur}
            keyboardType="numeric"
            placeholder="0"
            disabled={disabled}
            className="text-center"
          />
        </View>
      </View>
    </View>
  );
};
