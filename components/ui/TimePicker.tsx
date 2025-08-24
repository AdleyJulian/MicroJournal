import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from './text';

interface TimePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select time"
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Convert HH:MM string to Date object
  const timeToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convert Date object to HH:MM string
  const dateToTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format time for display (12-hour format)
  const formatDisplayTime = (timeString: string): string => {
    const [hour, minute] = timeString.split(':').map(Number);
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      const timeString = dateToTime(selectedDate);
      onValueChange(timeString);
    }
  };

  const currentDate = value ? timeToDate(value) : new Date();
  const displayText = value ? formatDisplayTime(value) : placeholder;

  return (
    <View className="w-full">
      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        className={`flex-row items-center justify-center rounded-md border border-input bg-background px-3 py-2 h-10 native:h-12 ${
          disabled ? 'opacity-50' : ''
        }`}
        disabled={disabled}
      >
        <Text className={`text-sm font-medium ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
          {displayText} 
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};
