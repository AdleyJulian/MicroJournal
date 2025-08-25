import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowRight, CheckCircle } from '@/lib/icons';

interface GettingStartedScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function GettingStartedScreen({ onComplete, onBack }: GettingStartedScreenProps) {
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
            <CheckCircle size={60} className="text-primary" />
          </View>
          <Text className="text-3xl font-bold text-foreground text-center mb-2">
            You're All Set!
          </Text>
          <Text className="text-lg text-muted-foreground text-center">
            Start building your life's tapestry
          </Text>
        </View>

        {/* Getting Started Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4 mt-0.5">
                <Text className="text-primary-foreground font-bold text-sm">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">Create Your First Memory</Text>
                <Text className="text-sm text-muted-foreground">
                  Tap the <Text className="font-semibold text-primary">Create</Text> tab and answer 3-5 simple questions about your day. Takes just a few minutes!
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4 mt-0.5">
                <Text className="text-primary-foreground font-bold text-sm">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">Review When Ready</Text>
                <Text className="text-sm text-muted-foreground">
                  The app will notify you when it's time to review. Check the <Text className="font-semibold text-primary">Review</Text> tab for due items.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4 mt-0.5">
                <Text className="text-primary-foreground font-bold text-sm">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">Rate Your Recall</Text>
                <Text className="text-sm text-muted-foreground">
                  Use the 4 rating buttons (Again, Hard, Good, Easy) to tell the algorithm how well you remembered.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4 mt-0.5">
                <Text className="text-primary-foreground font-bold text-sm">4</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">Watch Your Progress</Text>
                <Text className="text-sm text-muted-foreground">
                  Visit the <Text className="font-semibold text-primary">Home</Text> tab to see your memory statistics and streaks.
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <View className="flex-row items-start">
              <Text className="text-primary mr-3">•</Text>
              <Text className="text-sm text-foreground flex-1">
                <Text className="font-semibold">Be consistent:</Text> Daily engagement leads to the best results.
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-primary mr-3">•</Text>
              <Text className="text-sm text-foreground flex-1">
                <Text className="font-semibold">Quality over quantity:</Text> One meaningful memory is better than many forgettable ones.
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-primary mr-3">•</Text>
              <Text className="text-sm text-foreground flex-1">
                <Text className="font-semibold">Review regularly:</Text> The algorithm works best with consistent feedback.
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-primary mr-3">•</Text>
              <Text className="text-sm text-foreground flex-1">
                <Text className="font-semibold">Use images:</Text> Visual cues can significantly improve memory retention.
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Explore More Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <View className="flex-row items-center justify-between p-3 bg-secondary rounded-lg">
              <View className="flex-row items-center">
                <Plus size={20} className="text-primary mr-3" />
                <Text className="font-medium text-foreground">News Integration</Text>
              </View>
              <ArrowRight size={16} className="text-muted-foreground" />
            </View>
            <View className="flex-row items-center justify-between p-3 bg-secondary rounded-lg">
              <View className="flex-row items-center">
                <Text className="text-primary mr-3">📅</Text>
                <Text className="font-medium text-foreground">Calendar View</Text>
              </View>
              <ArrowRight size={16} className="text-muted-foreground" />
            </View>
            <View className="flex-row items-center justify-between p-3 bg-secondary rounded-lg">
              <View className="flex-row items-center">
                <Text className="text-primary mr-3">🔍</Text>
                <Text className="font-medium text-foreground">Advanced Search</Text>
              </View>
              <ArrowRight size={16} className="text-muted-foreground" />
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
            onPress={onComplete}
            className="flex-1"
          >
            <Text className="text-primary-foreground font-medium">Get Started</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
