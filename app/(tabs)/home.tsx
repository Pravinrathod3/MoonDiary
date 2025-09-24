import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

interface MoodButtonProps {
  emoji: string;
  onPress?: () => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ emoji, onPress }) => (
  <TouchableOpacity
    className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-soft mr-3"
    onPress={onPress}
  >
    <Text className="text-2xl">{emoji}</Text>
  </TouchableOpacity>
);

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, className = '' }) => (
  <View className={`bg-white rounded-2xl p-5 mb-4 shadow-soft ${className}`}>
    {children}
  </View>
);

const HomeScreen: React.FC = () => {
  const handleMoodSelect = (mood: string) => {
    console.log(`Selected mood: ${mood}`);
  };

  const handleJournalPress = () => {
    console.log('Open journal');
  };

  const handleSupportPress = () => {
    console.log('Open support');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center pt-4 pb-6">
          <View>
            <Text className="text-2xl font-bold text-textPrimary">Good Morning, Alex!</Text>
            <Text className="text-textSecondary mt-1">Today, July 24</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-soft">
            <Feather name="settings" size={20} color="#777777" />
          </TouchableOpacity>
        </View>

        {/* How are you feeling? */}
        <SectionCard>
          <Text className="text-lg font-semibold text-textPrimary mb-4">
            How are you feeling?
          </Text>
          <View className="flex-row">
            <MoodButton emoji="😊" onPress={() => handleMoodSelect('happy')} />
            <MoodButton emoji="😌" onPress={() => handleMoodSelect('calm')} />
            <MoodButton emoji="😐" onPress={() => handleMoodSelect('neutral')} />
            <MoodButton emoji="😰" onPress={() => handleMoodSelect('stressed')} />
            <MoodButton emoji="😢" onPress={() => handleMoodSelect('sad')} />
          </View>
        </SectionCard>

        {/* Quick Journal */}
        <SectionCard>
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-textPrimary">Quick Journal</Text>
              <Text className="text-textSecondary mt-1">Start writing or speaking</Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 bg-primary rounded-full items-center justify-center"
              onPress={handleJournalPress}
            >
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-background py-3 px-4 rounded-xl">
              <Text className="text-primary font-medium text-center">Voice</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-background py-3 px-4 rounded-xl">
              <Text className="text-primary font-medium text-center">Text</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Daily Check-in */}
        <SectionCard>
          <Text className="text-lg font-semibold text-textPrimary mb-1">Daily Check-in</Text>
          <Text className="text-textSecondary mb-3">What's on your mind today?</Text>
          
          <View className="flex-row items-center">
            <Text className="text-primary font-medium">Mood streak: 7 days</Text>
            <View className="ml-2 w-5 h-5 bg-mood-happy rounded-full items-center justify-center">
              <Text className="text-xs">🔥</Text>
            </View>
          </View>
        </SectionCard>

        {/* Insights Preview */}
        <SectionCard>
          <Text className="text-lg font-semibold text-textPrimary mb-1">Insights Preview</Text>
          <Text className="text-textSecondary mb-4">Recent mood trends</Text>
          
          <TouchableOpacity className="bg-primary/10 py-3 px-4 rounded-xl">
            <Text className="text-primary font-medium text-center">[Mini Sentiment Chart]</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Need Support? */}
        <SectionCard className="mb-8">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-secondary/20 rounded-full items-center justify-center mr-4">
              <Feather name="heart" size={20} color="#FF6B6B" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-textPrimary">Need Support?</Text>
              <Text className="text-textSecondary mt-1">Chat with our assistant or find help.</Text>
            </View>
            <TouchableOpacity onPress={handleSupportPress}>
              <Feather name="chevron-right" size={20} color="#777777" />
            </TouchableOpacity>
          </View>
        </SectionCard>
      </ScrollView>

      
    </SafeAreaView>
  );
};

export default HomeScreen;