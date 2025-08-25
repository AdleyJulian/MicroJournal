import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Target } from '@/lib/icons';

interface FSRSBenefitsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function FSRSBenefitsScreen({ onNext, onBack }: FSRSBenefitsScreenProps) {
  return (
    <View className="flex-1 bg-background px-6">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 40 }}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="mb-6 p-4 bg-primary/10 rounded-full">
            <Brain size={60} className="text-primary" />
          </View>
          <Text className="text-3xl font-bold text-foreground text-center mb-2">
            FSRS Algorithm
          </Text>
          <Text className="text-lg text-muted-foreground text-center">
            Advanced Memory Optimization
          </Text>
        </View>

        {/* What is FSRS */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">What is FSRS?</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-base text-foreground leading-6 mb-4">
              <Text className="font-semibold text-primary">Free Spaced Repetition Scheduler (FSRS)</Text>{" "}
              uses AI to learn your unique memory patterns and schedule reviews at the perfect time.
            </Text>
            <View className="bg-secondary p-4 rounded-lg">
              <Text className="text-sm text-muted-foreground">
                🤖 Unlike fixed schedules, FSRS adapts to your personal memory patterns for better retention.
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Advanced Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex-row items-center">
              <Zap size={24} className="text-primary mr-2" />
              Why FSRS Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">🎯</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Personalized for You</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Learns your unique memory patterns and adjusts schedules just for you.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">⚡</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Smart Timing</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Predicts when you're about to forget and schedules reviews at the perfect moment.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">📊</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Proven Results</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Research-backed algorithm that's more effective than traditional methods.
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Comparison */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">The Difference</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center p-3 bg-secondary rounded-lg">
                <Text className="text-sm font-medium text-foreground">Traditional</Text>
                <Text className="text-sm text-muted-foreground">Same schedule for everyone</Text>
              </View>
              <View className="flex-row justify-between items-center p-3 bg-primary/10 rounded-lg">
                <Text className="text-sm font-medium text-primary">FSRS</Text>
                <Text className="text-sm text-primary">Custom schedule for you</Text>
              </View>
            </View>
            <Text className="text-xs text-muted-foreground mt-3 text-center">
              Up to 30% less review time, better retention
            </Text>
          </CardContent>
        </Card>

        {/* Navigation */}
        <View className="flex-row space-x-4 mt-8">
          <Button
            onPress={onBack}
            variant="outline"
            className="flex-1"
          >
            <Text className="font-medium">Back</Text>
          </Button>

          <Button
            onPress={onNext}
            className="flex-1"
          >
            <Text className="text-primary-foreground font-medium">Next</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
