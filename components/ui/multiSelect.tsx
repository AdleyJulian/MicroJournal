import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "~/lib/utils";

// Type definitions
export type MultiSelectItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type MultiSelectProps = {
  /** Array of options to select from */
  data: (MultiSelectItem | string)[];
  /** Currently selected values */
  value?: string[];
  /** Called when selection changes */
  onChange?: (values: string[]) => void;
  /** Placeholder text when no options are selected */
  placeholder?: string;
  /** Whether the component allows searching */
  searchable?: boolean;
  /** Message to display when no options match search */
  nothingFoundMessage?: string;
  /** Whether to show a clear button */
  clearable?: boolean;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is read-only */
  readOnly?: boolean;
  /** Maximum number of values that can be selected */
  maxValues?: number;
  /** Called when an item is removed */
  onRemove?: (value: string) => void;
  /** Called when the clear button is clicked */
  onClear?: () => void;
  /** Label for the component */
  label?: string;
  /** Error message */
  error?: string;
  /** Additional class names */
  className?: string;
  /** Style for dropdown position and appearance */
  dropdownStyle?: {
    top?: number;
    maxHeight?: number;
  };
};

/**
 * MultiSelect component for React Native with NativeWind
 * A component that allows selecting multiple items from a dropdown list
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  data = [],
  value = [],
  onChange,
  placeholder = "Select items",
  searchable = true,
  nothingFoundMessage = "Nothing found",
  clearable = false,
  disabled = false,
  readOnly = false,
  maxValues = Infinity,
  onRemove,
  onClear,
  label,
  error,
  className = "",
  dropdownStyle = { top: 40, maxHeight: 300 },
}) => {
  const [dropdownOpened, setDropdownOpened] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  // Convert data to a standard format
  const parsedData: MultiSelectItem[] = data.map((item) => {
    if (typeof item === "string") {
      return { value: item, label: item };
    }
    return item;
  });

  // Create a map for quick lookups
  const optionsLookup: Record<string, MultiSelectItem> = parsedData.reduce(
    (acc, item) => {
      acc[item.value] = item;
      return acc;
    },
    {} as Record<string, MultiSelectItem>
  );

  const handleToggleDropdown = (): void => {
    if (!disabled && !readOnly) {
      setDropdownOpened(!dropdownOpened);
    }
  };

  const handleClear = (): void => {
    onChange?.([]);
    onClear?.();
    setSearchValue("");
  };

  const handleOptionSelect = (optionValue: string): void => {
    if (value.includes(optionValue)) {
      const newValue = value.filter((v) => v !== optionValue);
      onChange?.(newValue);
      onRemove?.(optionValue);
    } else if (value.length < maxValues) {
      onChange?.([...value, optionValue]);
    }
    setSearchValue("");
  };

  const handleRemovePill = (pillValue: string): void => {
    if (!readOnly && !optionsLookup[pillValue]?.disabled) {
      const newValue = value.filter((v) => v !== pillValue);
      onChange?.(newValue);
      onRemove?.(pillValue);
    }
  };

  const handleSearchChange = (text: string): void => {
    setSearchValue(text);
  };

  // Filter options based on search
  const filteredOptions = parsedData.filter((option) => {
    if (!searchable || searchValue.trim() === "") return true;
    return option.label.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <View className={cn("mb-4", className)}>
      {label && <Text className="font-medium text-gray-700 mb-1">{label}</Text>}

      <TouchableOpacity
        onPress={handleToggleDropdown}
        className={cn(
          "border rounded-md px-3 py-2 min-h-12 flex-row flex-wrap items-center",
          error ? "border-red-500" : "border-gray-300",
          disabled ? "bg-gray-100" : "bg-white",
          "relative"
        )}
        disabled={disabled || readOnly}
        activeOpacity={0.7}
      >
        <View className="flex-row flex-wrap flex-1">
          {value.length > 0
            ? value.map((item, index) => (
                <View
                  key={`${item}-${index}`}
                  className="bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1 flex-row items-center"
                  testID={`selected-item-${item}`}
                >
                  <Text className="text-gray-700">
                    {optionsLookup[item]?.label || item}
                  </Text>
                  {!readOnly && !optionsLookup[item]?.disabled && (
                    <TouchableOpacity
                      onPress={() => handleRemovePill(item)}
                      className="ml-1"
                      testID={`remove-item-${item}`}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close-circle" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            : null}

          {searchable && (
            <TextInput
              className="flex-1 min-w-20 p-1"
              placeholder={value.length === 0 ? placeholder : ""}
              value={searchValue}
              onChangeText={handleSearchChange}
              onFocus={() => setDropdownOpened(true)}
              editable={!disabled && !readOnly}
              testID="multiselect-search-input"
            />
          )}

          {!searchable && value.length === 0 && (
            <Text className="text-gray-500">{placeholder}</Text>
          )}
        </View>

        <View className="flex-row items-center">
          {clearable && value.length > 0 && !disabled && !readOnly && (
            <TouchableOpacity
              onPress={handleClear}
              className="mr-2"
              testID="multiselect-clear-button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}

          <Ionicons
            name={dropdownOpened ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B7280"
          />
        </View>
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-sm mt-1" testID="multiselect-error">
          {error}
        </Text>
      )}

      <Modal
        visible={dropdownOpened}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownOpened(false)}
        testID="multiselect-dropdown-modal"
      >
        <Pressable
          className="flex-1 bg-black bg-opacity-20"
          onPress={() => setDropdownOpened(false)}
          testID="modal-backdrop"
        >
          <View
            className={`m-4 bg-white rounded-lg shadow-lg mt-${dropdownStyle.top || 40}`}
            style={{ maxHeight: dropdownStyle.maxHeight || 300 }}
          >
            <ScrollView>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleOptionSelect(option.value)}
                    className={cn(
                      "px-4 py-3 border-b border-gray-100 flex-row justify-between items-center",
                      option.disabled ? "opacity-50" : "",
                      value.includes(option.value) ? "bg-blue-50" : ""
                    )}
                    disabled={option.disabled}
                    testID={`option-${option.value}`}
                  >
                    <Text
                      className={
                        value.includes(option.value)
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }
                    >
                      {option.label}
                    </Text>

                    {value.includes(option.value) && (
                      <Ionicons name="checkmark" size={18} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View className="p-4">
                  <Text
                    className="text-gray-500 text-center"
                    testID="nothing-found"
                  >
                    {nothingFoundMessage}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
