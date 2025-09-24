import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  preview: string;
  mood?: string;
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  date: Date;
}

const JournalApp: React.FC = () => {
  const today = new Date(2025, 8, 24); // September 24, 2025 (month is 0-indexed)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // September 2025
  const [selectedDate, setSelectedDate] = useState(24); // 24th selected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string>('');

  // Sample journal entries for September 2025
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      date: 'September 24, 2025',
      title: 'Today was a mix of emotions. Started with a productive morning, but the...',
      preview: '',
      mood: 'neutral'
    },
    {
      id: '2',
      date: 'September 20, 2025',
      title: 'Reflecting on how far I\'ve made progress in several areas. Still working...',
      preview: '',
      mood: 'happy'
    },
    {
      id: '3',
      date: 'September 15, 2025',
      title: 'Had a great conversation with a friend today...',
      preview: '',
      mood: 'happy'
    }
  ];

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and number of days
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get previous month info
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // Add days from previous month
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      days.push({
        day,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date
      });
    }
    
    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = day === selectedDate && 
                        month === currentDate.getMonth() && 
                        year === currentDate.getFullYear();
      
      days.push({
        day,
        isCurrentMonth: true,
        isSelected,
        isToday,
        date
      });
    }
    
    // Add days from next month to complete the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    for (let i = days.length; i < totalCells; i++) {
      const date = new Date(year, month + 1, nextMonthDay);
      days.push({
        day: nextMonthDay,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        date
      });
      nextMonthDay++;
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDateSelect = (day: number, isCurrentMonth: boolean, date: Date) => {
    if (isCurrentMonth) {
      setSelectedDate(day);
    } else {
      // If selecting a date from prev/next month, navigate to that month
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
      setSelectedDate(day);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <Text className="text-xl font-semibold text-textPrimary">Journal</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#777777" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Search and Filters */}
        <View className="px-6 py-4 bg-white border-b border-gray-100">
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <Ionicons name="search" size={20} color="#777777" className="mr-3" />
            <TextInput
              placeholder="Search entries"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-textPrimary ml-3"
              placeholderTextColor="#777777"
            />
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-row items-center bg-primary/10 px-4 py-2 rounded-full">
              <Text className="text-primary font-medium mr-2">Mood</Text>
              <Ionicons name="chevron-down" size={16} color="#4A90E2" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full">
              <Text className="text-textSecondary font-medium mr-2">Tags</Text>
              <Ionicons name="chevron-down" size={16} color="#777777" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <View className="bg-white mx-6 my-4 rounded-2xl p-4 shadow-soft">
          {/* Calendar Header */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => navigateMonth('prev')}>
              <Ionicons name="chevron-back" size={24} color="#777777" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-textPrimary">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth('next')}>
              <Ionicons name="chevron-forward" size={24} color="#777777" />
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View className="flex-row justify-between mb-3">
            {weekDays.map((day, index) => (
              <View key={index} className="w-10 h-10 items-center justify-center">
                <Text className="text-textSecondary font-medium text-sm">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex-row flex-wrap">
            {calendarDays.map((calendarDay, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(calendarDay.day, calendarDay.isCurrentMonth, calendarDay.date)}
                className="w-10 h-10 items-center justify-center m-1"
              >
                <View
                  className={`w-8 h-8 items-center justify-center rounded-full ${
                    calendarDay.isSelected
                      ? 'bg-primary'
                      : calendarDay.isToday
                      ? 'bg-primary/20'
                      : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      calendarDay.isSelected
                        ? 'text-white'
                        : calendarDay.isToday
                        ? 'text-primary font-semibold'
                        : calendarDay.isCurrentMonth
                        ? 'text-textPrimary'
                        : 'text-textSecondary/50'
                    }`}
                  >
                    {calendarDay.day}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Journal Entries */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-textPrimary mb-4">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          {journalEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-soft"
            >
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3 mt-1">
                  <Ionicons name="create-outline" size={16} color="#4A90E2" />
                </View>
                
                <View className="flex-1">
                  <Text className="text-textPrimary font-semibold mb-1">{entry.date}</Text>
                  <Text className="text-textSecondary leading-5" numberOfLines={2}>
                    {entry.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-soft">
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default JournalApp;