import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Achievement {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconColor: string;
  isCompleted: boolean;
  title?: string;
}

interface UserStats {
  entries: number;
  dayStreak: number;
}

const ProfileScreen: React.FC = () => {
  const userStats: UserStats = {
    entries: 45,
    dayStreak: 15,
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      icon: 'trophy',
      backgroundColor: '#FFE4E1',
      iconColor: '#FF6B6B',
      isCompleted: true,
      title: 'First Entry'
    },
    {
      id: '2',
      icon: 'flame',
      backgroundColor: '#E8F5E8',
      iconColor: '#7ED6A0',
      isCompleted: true,
      title: '7 Day Streak'
    },
    {
      id: '3',
      icon: 'star',
      backgroundColor: '#E8F1FF',
      iconColor: '#4A90E2',
      isCompleted: true,
      title: '10 Entries'
    },
    {
      id: '4',
      icon: 'heart',
      backgroundColor: '#F5F5F5',
      iconColor: '#CCCCCC',
      isCompleted: false,
      title: 'Gratitude Master'
    },
    {
      id: '5',
      icon: 'calendar',
      backgroundColor: '#F5F5F5',
      iconColor: '#CCCCCC',
      isCompleted: false,
      title: '30 Day Streak'
    },
    {
      id: '6',
      icon: 'bookmark',
      backgroundColor: '#E6F7F7',
      iconColor: '#4ECDC4',
      isCompleted: true,
      title: 'Mood Tracker'
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <Text className="text-xl font-semibold text-textPrimary">Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#777777" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View className="items-center py-8 bg-white">
          {/* Avatar */}
          <View className="w-24 h-24 rounded-full mb-4 overflow-hidden shadow-soft">
            <View className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 items-center justify-center">
              {/* Placeholder avatar - you can replace with actual image */}
              <View className="w-20 h-20 rounded-full bg-orange-100 items-center justify-center">
                <View className="w-16 h-16 rounded-full bg-white/30 items-center justify-center">
                  <View className="w-8 h-8 bg-orange-800 rounded-full mb-1" />
                  <View className="w-12 h-6 bg-orange-800 rounded-t-full" />
                </View>
              </View>
            </View>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-bold text-textPrimary mb-1">Sophia Carter</Text>
          <Text className="text-textSecondary text-sm">Joined July 2023</Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-6 mb-6 space-x-4">
          {/* Entries Card */}
          <View className="flex-1 bg-gray-100 rounded-2xl p-4 items-center">
            <Text className="text-3xl font-bold text-textPrimary mb-1">
              {userStats.entries}
            </Text>
            <Text className="text-textSecondary text-sm font-medium">Entries</Text>
          </View>

          {/* Day Streak Card */}
          <View className="flex-1 bg-gray-100 rounded-2xl p-4 items-center">
            <Text className="text-3xl font-bold text-textPrimary mb-1">
              {userStats.dayStreak}
            </Text>
            <Text className="text-textSecondary text-sm font-medium">Day Streak</Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="px-6 pb-8">
          <Text className="text-xl font-semibold text-textPrimary mb-4">Achievements</Text>
          
          {/* Achievements Grid */}
          <View className="flex-row flex-wrap justify-between">
            {achievements.map((achievement, index) => (
              <TouchableOpacity
                key={achievement.id}
                className="w-[30%] mb-4 items-center"
              >
                <View
                  className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
                    achievement.isCompleted ? 'shadow-soft' : ''
                  }`}
                  style={{
                    backgroundColor: achievement.backgroundColor,
                  }}
                >
                  <Ionicons
                    name={achievement.icon}
                    size={24}
                    color={achievement.iconColor}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Settings or Options */}
        <View className="px-6 pb-6">
          <View className="bg-white rounded-2xl shadow-soft">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="person-outline" size={20} color="#4A90E2" />
                </View>
                <Text className="text-textPrimary font-medium">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-accent/20 rounded-full items-center justify-center mr-3">
                  <Ionicons name="notifications-outline" size={20} color="#7ED6A0" />
                </View>
                <Text className="text-textPrimary font-medium">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-secondary/20 rounded-full items-center justify-center mr-3">
                  <Ionicons name="shield-outline" size={20} color="#FF6B6B" />
                </View>
                <Text className="text-textPrimary font-medium">Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-mood-happy/20 rounded-full items-center justify-center mr-3">
                  <Ionicons name="help-circle-outline" size={20} color="#FFD93D" />
                </View>
                <Text className="text-textPrimary font-medium">Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;