import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp } from '@/lib/icons';

interface SpacedRepetitionScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function SpacedRepetitionScreen({ onNext, onBack }: SpacedRepetitionScreenProps) {
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
            <Clock size={60} className="text-primary" />
          </View>
          <Text className="text-3xl font-bold text-foreground text-center mb-2">
          Remember Your Life
          </Text>
          <Text className="text-lg text-muted-foreground text-center">
            In detail. In minutes a day.
          </Text>
        </View>

        {/* Main Content */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <Text className="text-base text-foreground leading-6">
              Our app helps you build a vivid, lasting autobiographical memory, turning forgotten days into a rich tapestry of your life's experiences.
            </Text>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">How It Works:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Text className="text-base text-foreground leading-6">
              We combine two powerful techniques into one simple, daily habit:
            </Text>


              <Text className="text-sm font-semibold text-foreground mb-2">📝 Micro-Journaling</Text>
              <Text className="text-sm text-muted-foreground">
                Every day you'll record 3-5 simple questions and answers.
              </Text>
              <Text className="text-sm text-muted-foreground">
              Each is a memory anchor that helps you recall your day.
              </Text>



              <Text className="text-sm font-semibold text-foreground mb-2">🧠 Intelligent Flashcards</Text>
              <Text className="text-sm text-muted-foreground">
              Your entries become flashcards. Our spaced repetition system (FSRS) shows them to you right before you forget.
              </Text>

          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex-row items-center">
              <TrendingUp size={24} className="text-primary mr-2" />
              The Benefits of a Stronger Memory ✨
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">🧠</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Remember More, Effortlessly</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Transform fleeting moments into lasting memories. Recall conversations, places, and feelings with surprising clarity.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">💭</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Deeper Self-Reflection</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  By revisiting your past experiences, you'll notice patterns, appreciate your personal growth, and gain a deeper understanding of who you are.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">✨</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Combat the "Blur"</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Stop letting your days fade away. Each entry gives a day its own unique identity, creating a searchable, reviewable timeline of your life.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Text className="text-primary font-bold mr-3">📚</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">A Sustainable Habit</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  The process is quick, engaging, and scientifically optimized to deliver the best results with the least amount of effort. Build a priceless personal archive in just minutes a day.
                </Text>
              </View>
            </View>
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
