import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../services/supabase';

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

const JournalCard = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchJournalEntry();
        }
    }, [id]);

    const fetchJournalEntry = async () => {
        try {
            setLoading(true);
            console.log('Fetching journal entry with ID:', id);
            
            const { data, error } = await supabase
                .from('journals')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Fetched journal entry:', data);
            setJournalEntry(data);
        } catch (error) {
            console.error('Error fetching journal entry:', error);
            Alert.alert(
                'Error', 
                'Failed to load journal entry. Please try again.',
                [
                    { text: 'Go Back', onPress: () => router.back() },
                    { text: 'Retry', onPress: () => fetchJournalEntry() }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

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

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatTime = (timeString: string) => {
        try {
            if (!timeString) return 'No time recorded';
            const time = new Date(`2000-01-01T${timeString}`);
            return time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return 'Invalid Time';
        }
    };

    const renderEmotionsList = (emotions: any) => {
        if (!emotions || typeof emotions !== 'object') return null;
        
        return Object.entries(emotions).map(([emotion, intensity]) => (
            <View 
                key={emotion} 
                className="bg-gray-50 px-3 py-2 rounded-full mr-2 mb-2"
            >
                <Text className="text-textPrimary text-sm capitalize">
                    {emotion}: {Math.round(Number(intensity) * 100)}%
                </Text>
            </View>
        ));
    };

    const renderInsights = (insights: any) => {
        if (!insights) return null;

        if (Array.isArray(insights)) {
            return insights.map((insight: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                    <Text className="text-green-600 mr-2">•</Text>
                    <Text className="text-textPrimary flex-1 leading-6">
                        {insight}
                    </Text>
                </View>
            ));
        } else if (typeof insights === 'string') {
            return (
                <Text className="text-textPrimary leading-6">
                    {insights}
                </Text>
            );
        } else {
            return (
                <Text className="text-textPrimary leading-6">
                    {JSON.stringify(insights, null, 2)}
                </Text>
            );
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text className="text-textSecondary mt-4">Loading journal entry...</Text>
            </View>
        );
    }

    if (!journalEntry) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <Ionicons name="document-text-outline" size={64} color="#777777" />
                <Text className="text-textSecondary text-lg mt-4">Journal entry not found</Text>
                <Text className="text-textSecondary text-center mt-2">
                    The entry may have been deleted or doesn't exist.
                </Text>
                <TouchableOpacity 
                    className="bg-primary px-6 py-3 rounded-full mt-6"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-semibold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="bg-white px-6 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="flex-row items-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="#4A90E2" />
                        <Text className="text-primary ml-2 text-lg">Back to Journal</Text>
                    </TouchableOpacity>
                    
                    {/* Edit button - you can implement edit functionality later */}
                    <TouchableOpacity className="p-2">
                        <Ionicons name="create-outline" size={24} color="#777777" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Journal Content */}
                <View className="p-6">
                    {/* Date and Feeling Header */}
                    <View className="bg-white rounded-2xl p-6 mb-4 shadow-soft">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-1">
                                <Text className="text-2xl font-bold text-textPrimary">
                                    {formatDate(journalEntry.date)}
                                </Text>
                                {journalEntry.time && (
                                    <Text className="text-textSecondary mt-1">
                                        {formatTime(journalEntry.time)}
                                    </Text>
                                )}
                            </View>
                            <View className="flex-row items-center bg-primary/10 px-4 py-2 rounded-full">
                                <Text className="text-2xl mr-2">
                                    {getFeelingEmoji(journalEntry.feeling)}
                                </Text>
                                <Text className="text-primary font-semibold capitalize">
                                    {journalEntry.feeling}
                                </Text>
                            </View>
                        </View>

                        {/* Confidence Score */}
                        {journalEntry.confidence_score > 0 && (
                            <View className="bg-gray-50 rounded-lg p-3">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-textSecondary text-sm">Confidence Score</Text>
                                    <Text className="text-textPrimary font-semibold">
                                        {journalEntry.confidence_score}%
                                    </Text>
                                </View>
                                <View className="w-full bg-gray-200 rounded-full h-2">
                                    <View 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${journalEntry.confidence_score}%` }}
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Journal Text */}
                    <View className="bg-white rounded-2xl p-6 mb-4 shadow-soft">
                        <Text className="text-lg font-semibold text-textPrimary mb-3">
                            Your Journal Entry
                        </Text>
                        <Text className="text-textPrimary leading-7 text-base">
                            {journalEntry.text}
                        </Text>
                    </View>

                    {/* AI Summary */}
                    {journalEntry.summary && (
                        <View className="bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-100">
                            <View className="flex-row items-center mb-3">
                                <Ionicons name="sparkles" size={20} color="#4A90E2" />
                                <Text className="text-lg font-semibold text-textPrimary ml-2">
                                    AI Summary
                                </Text>
                            </View>
                            <Text className="text-textPrimary leading-6">
                                {journalEntry.summary}
                            </Text>
                        </View>
                    )}

                    {/* Emotions Analysis */}
                    {journalEntry.emotions && Object.keys(journalEntry.emotions).length > 0 && (
                        <View className="bg-white rounded-2xl p-6 mb-4 shadow-soft">
                            <Text className="text-lg font-semibold text-textPrimary mb-3">
                                Emotions Detected
                            </Text>
                            <View className="flex-row flex-wrap">
                                {renderEmotionsList(journalEntry.emotions)}
                            </View>
                        </View>
                    )}

                    {/* Insights */}
                    {journalEntry.insights && (
                        <View className="bg-green-50 rounded-2xl p-6 mb-4 border border-green-100">
                            <View className="flex-row items-center mb-3">
                                <Ionicons name="bulb-outline" size={20} color="#34C759" />
                                <Text className="text-lg font-semibold text-textPrimary ml-2">
                                    Personal Insights
                                </Text>
                            </View>
                            {renderInsights(journalEntry.insights)}
                        </View>
                    )}

                    {/* Stats Card */}
                    <View className="bg-white rounded-2xl p-6 mb-4 shadow-soft">
                        <Text className="text-lg font-semibold text-textPrimary mb-3">
                            Entry Statistics
                        </Text>
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-primary">
                                    {journalEntry.text.split(' ').length}
                                </Text>
                                <Text className="text-textSecondary text-sm">Words</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-primary">
                                    {journalEntry.text.length}
                                </Text>
                                <Text className="text-textSecondary text-sm">Characters</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-primary">
                                    {journalEntry.confidence_score || 0}%
                                </Text>
                                <Text className="text-textSecondary text-sm">Confidence</Text>
                            </View>
                        </View>
                    </View>

                    {/* Metadata */}
                    <View className="bg-gray-50 rounded-2xl p-6 mt-4">
                        <Text className="text-textSecondary text-sm mb-2">
                            <Text className="font-medium">Entry ID:</Text> {journalEntry.id}
                        </Text>
                        <Text className="text-textSecondary text-sm">
                            <Text className="font-medium">Created:</Text> {new Date(journalEntry.created_at).toLocaleDateString()} at{' '}
                            {new Date(journalEntry.created_at).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="bg-white border-t border-gray-100 p-6">
                <View className="flex-row space-x-4">
                    <TouchableOpacity 
                        className="flex-1 bg-gray-100 py-3 px-4 rounded-xl flex-row items-center justify-center"
                        onPress={() => {
                            // Implement share functionality
                            Alert.alert('Share', 'Share functionality coming soon!');
                        }}
                    >
                        <Ionicons name="share-outline" size={20} color="#777777" />
                        <Text className="text-textSecondary font-medium ml-2">Share</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        className="flex-1 bg-primary py-3 px-4 rounded-xl flex-row items-center justify-center"
                        onPress={() => {
                            // Implement edit functionality
                            Alert.alert('Edit', 'Edit functionality coming soon!');
                        }}
                    >
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text className="text-white font-medium ml-2">Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default JournalCard;