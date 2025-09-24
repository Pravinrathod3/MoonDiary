import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../../services/supabase';

interface JournalEntry {
  id: number;
  date: string;
  time: string;
  feeling: string;
  text: string;
  emotions: any;
  confidence_score: number;
  summary: string;
  insights: any;
  created_at: string;
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  date: Date;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_entry_date: string;
  total_entries: number;
}

const JournalApp: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [searchQuery, setSearchQuery] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  const router = useRouter();

  // Get device ID for anonymous tracking
  useEffect(() => {
    getDeviceId();
  }, []);

  // Fetch journal entries when month changes
  useEffect(() => {
    if (deviceId) {
      fetchJournalEntries();
      fetchStreakData();
    }
  }, [currentDate, deviceId]);

  const getDeviceId = async () => {
    try {
      let id;
      if (Platform.OS === 'android') {
        id = Application.androidId;
      } else {
        id = await Application.getIosIdForVendorAsync();
      }
      setDeviceId(id || 'default-device');
    } catch (error) {
      console.error('Error getting device ID:', error);
      setDeviceId('default-device');
    }
  };

  // Fetch journal entries from Supabase
  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      Alert.alert('Error', 'Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch streak data
  const fetchStreakData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('device_id', deviceId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setStreakData(data || {
        current_streak: 0,
        longest_streak: 0,
        last_entry_date: null,
        total_entries: 0
      });
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  // Create a new journal entry
  const createJournalEntry = () => {
    router.push('/(tabs)/home/new');
  };

  // Delete a journal entry
  const deleteJournalEntry = async (entryId: number) => {
    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      Alert.alert('Success', 'Journal entry deleted');
      fetchJournalEntries();
      fetchStreakData();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      Alert.alert('Error', 'Failed to delete journal entry');
    }
  };

  // Search journal entries
  const searchEntries = async (query: string) => {
    if (!query.trim()) {
      fetchJournalEntries();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .or(`text.ilike.%${query}%,feeling.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error searching entries:', error);
    }
  };

  // Filter by feeling/mood
  const filterByFeeling = async (feeling: string) => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('feeling', feeling)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error filtering by feeling:', error);
    }
  };

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
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

  // Get feeling emoji
  const getFeelingEmoji = (feeling: string) => {
    const feelingMap: { [key: string]: string } = {
      'sad': '😢',
      'neutral': '😐',
      'happy': '😊',
      'excited': '😃',
      'excellent': '🤩',
      'anxious': '😰',
      'angry': '😠',
      'grateful': '🙏',
      'tired': '😴',
      'peaceful': '😌'
    };
    return feelingMap[feeling] || '📝';
  };

  // Format date for display
  const formatJournalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header with Streak Info */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <View>
          <Text className="text-xl font-semibold text-textPrimary">Journal</Text>
          {streakData && (
            <Text className="text-sm text-textSecondary">
              🔥 {streakData.current_streak} day streak • {streakData.total_entries} entries
            </Text>
          )}
        </View>
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
              placeholder="Search entries..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchEntries(text);
              }}
              className="flex-1 text-textPrimary ml-3"
              placeholderTextColor="#777777"
            />
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="flex-row items-center bg-primary/10 px-4 py-2 rounded-full"
              onPress={() => {
                Alert.alert(
                  'Filter by Feeling',
                  'Select a feeling to filter',
                  [
                    { text: '😢 Sad', onPress: () => filterByFeeling('sad') },
                    { text: '😐 Neutral', onPress: () => filterByFeeling('neutral') },
                    { text: '😊 Happy', onPress: () => filterByFeeling('happy') },
                    { text: '😃 Excited', onPress: () => filterByFeeling('excited') },
                    { text: '🤩 Excellent', onPress: () => filterByFeeling('excellent') },
                    { text: '😰 Anxious', onPress: () => filterByFeeling('anxious') },
                    { text: 'Clear Filter', onPress: () => fetchJournalEntries(), style: 'destructive' },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text className="text-primary font-medium mr-2">Feeling</Text>
              <Ionicons name="chevron-down" size={16} color="#4A90E2" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full"
              onPress={() => fetchJournalEntries()}
            >
              <Text className="text-textSecondary font-medium mr-2">Show All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <View className="bg-white mx-6 my-4 rounded-2xl p-4 shadow-soft">
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
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-textPrimary">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <Text className="text-textSecondary">
              {journalEntries.length} entries
            </Text>
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : journalEntries.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center justify-center">
              <Ionicons name="journal-outline" size={48} color="#777777" />
              <Text className="text-textSecondary text-lg mt-4 text-center">
                No journal entries for this month{'\n'}
                Start writing to see your entries here!
              </Text>
            </View>
          ) : (
            journalEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-soft"
                onPress={() => console.log(entry.id)}
                onLongPress={() => {
                  Alert.alert(
                    'Delete Entry',
                    'Are you sure you want to delete this entry?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteJournalEntry(entry.id) },
                    ]
                  );
                }}
              >
                <View className="flex-row items-start">
                  <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3 mt-1">
                    <Text className="text-lg">{getFeelingEmoji(entry.feeling)}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="text-textPrimary font-semibold">
                        {formatJournalDate(entry.date)}
                      </Text>
                      <Text className="text-textSecondary text-sm capitalize">
                        {entry.feeling}
                      </Text>
                    </View>
                    <Text className="text-textSecondary leading-5" numberOfLines={3}>
                      {entry.text.substring(0, 120)}...
                    </Text>
                    {entry.confidence_score > 0 && (
                      <Text className="text-xs text-textSecondary mt-1">
                        Confidence: {entry.confidence_score}%
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-soft"
        onPress={createJournalEntry}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default JournalApp;