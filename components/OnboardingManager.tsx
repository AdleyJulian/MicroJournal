/*
import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import { FSRSBenefitsScreen } from './onboarding/FSRSBenefitsScreen';
import { SpacedRepetitionScreen } from './onboarding/SpacedRepetitionScreen';
import { GettingStartedScreen } from './onboarding/GettingStartedScreen';

interface OnboardingManagerProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function OnboardingManager({ visible, onComplete, onCancel }: OnboardingManagerProps) {
  const [currentScreen, setCurrentScreen] = useState<'fsrs' | 'spaced' | 'getting-started'>('fsrs');

  const handleNext = () => {
    switch (currentScreen) {
      case 'fsrs':
        setCurrentScreen('spaced');
        break;
      case 'spaced':
        setCurrentScreen('getting-started');
        break;
      case 'getting-started':
        onComplete();
        break;
    }
  };

  const handleBack = () => {
    switch (currentScreen) {
      case 'spaced':
        setCurrentScreen('fsrs');
        break;
      case 'getting-started':
        setCurrentScreen('spaced');
        break;
      case 'fsrs':
        onCancel();
        break;
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'fsrs':
        return <FSRSBenefitsScreen onNext={handleNext} onBack={handleBack} />;
      case 'spaced':
        return <SpacedRepetitionScreen onNext={handleNext} onBack={handleBack} />;
      case 'getting-started':
        return <GettingStartedScreen onComplete={onComplete} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1">
        {renderCurrentScreen()}
      </View>
    </Modal>
  );
}
*/
