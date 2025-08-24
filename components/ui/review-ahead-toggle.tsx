import React from "react";
import { ReviewTimePicker } from "./ReviewTimePicker";

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
  if (disabled) {
    return null;
  }

  return (
    <ReviewTimePicker
      selectedDays={daysAhead}
      selectedForgottenDays={forgottenDays}
      onDaysChange={onDaysChange}
      onForgottenDaysChange={onForgottenDaysChange}
    />
  );
};
