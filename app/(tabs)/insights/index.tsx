import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface InsightItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

const InsightsScreen: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;

  // Sample mood data for the last 7 days
  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [6.5, 8.2, 7.8, 6.8, 5.2, 8.5, 7.9],
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // primary color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(119, 119, 119, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4A90E2',
      fill: '#ffffff',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#f0f0f0',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'System',
    },
    fillShadowGradient: '#4A90E2',
    fillShadowGradientOpacity: 0.1,
  };

  const keyInsights: InsightItem[] = [
    {
      id: '1',
      title: 'Weekend Mood Boost',
      description: 'Your mood tends to be higher on weekends.',
      icon: 'sunny',
      iconColor: '#FFD93D',
      backgroundColor: '#FFF9E6',
    },
    {
      id: '2',
      title: 'Gratitude Practice',
      description: "You've practiced gratitude 15 times this month.",
      icon: 'heart',
      iconColor: '#7ED6A0',
      backgroundColor: '#F0FDF4',
    },
  ];

  // Calculate average from mood data
  const calculateAverage = () => {
    const total = moodData.datasets[0].data.reduce((sum, value) => sum + value, 0);
    return (total / moodData.datasets[0].data.length).toFixed(1);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white">
        <TouchableOpacity className="mr-4">
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-textPrimary flex-1">Insights</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#777777" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Mood Timeline Card */}
        <View className="mx-6 my-4 bg-white rounded-2xl p-6 shadow-soft">
          {/* Card Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-textSecondary text-sm font-medium mb-1">Mood Timeline</Text>
              <View className="flex-row items-baseline">
                <Text className="text-3xl font-bold text-textPrimary mr-2">
                  Average: {calculateAverage()}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Text className="text-textSecondary text-sm mr-1">Last 30 Days</Text>
                <View className="flex-row items-center">
                  <Text className="text-accent font-semibold text-sm">+12%</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#777777" />
            </TouchableOpacity>
          </View>

          {/* Chart */}
          <View className="mb-2">
            <LineChart
              data={moodData}
              width={screenWidth - 80}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: -16,
              }}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={true}
              withShadow={false}
              fromZero={false}
              segments={4}
            />
          </View>
        </View>

        {/* Key Insights Section */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-semibold text-textPrimary mb-4">Key Insights</Text>
          
          {keyInsights.map((insight) => (
            <TouchableOpacity
              key={insight.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-soft"
            >
              <View className="flex-row items-start">
                {/* Icon Container */}
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: insight.backgroundColor }}
                >
                  <Ionicons 
                    name={insight.icon} 
                    size={24} 
                    color={insight.iconColor} 
                  />
                </View>
                
                {/* Content */}
                <View className="flex-1">
                  <Text className="text-textPrimary font-semibold text-base mb-1">
                    {insight.title}
                  </Text>
                  <Text className="text-textSecondary text-sm leading-5">
                    {insight.description}
                  </Text>
                </View>

                {/* Arrow */}
                <View className="ml-2">
                  <Ionicons name="chevron-forward" size={20} color="#777777" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsightsScreen;