import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
    bg: '#FBF7FF',
    card: '#FFFFFF',
    pink: '#F472B6',
    pinkLight: '#FDF2F8',
    purple: '#A78BFA',
    purpleLight: '#F5F3FF',
    purpleMid: '#DDD6FE',
    teal: '#5BB8A0',
    tealLight: '#EDFAF5',
    amber: '#FBBF24',
    amberLight: '#FFFBEB',
    text: '#2D1F3D',
    textMid: '#7A6A8A',
    textSoft: '#B8A8CC',
};

// ─── Ripple Background ────────────────────────────────────────────────────────
function RippleBackground() {
    const ripples = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        const animate = (anim: Animated.Value, startAt: number) => {
            anim.setValue(startAt);
            Animated.loop(
                Animated.timing(anim, { toValue: 1, duration: 6500, useNativeDriver: true })
            ).start();
        };
        ripples.forEach((r, i) => animate(r, i * 0.5));
    }, []);

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.5] });
                const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.08, 0.03, 0] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: width * 1,
                            height: width * 1,
                            borderRadius: width * 0.5,
                            borderWidth: 2,
                            borderColor: i === 0 ? P.purple : P.amber,
                            top: height * 0.1,
                            left: 0,
                            transform: [{ scale }],
                            opacity,
                        }}
                    />
                );
            })}
        </View>
    );
}

export default function StreakCalendarScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dates = [
        { day: 10, completed: true },
        { day: 11, completed: true },
        { day: 12, completed: true },
        { day: 13, completed: true },
        { day: 14, completed: true },
        { day: 15, completed: false },
        { day: 16, completed: true },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Streak Calendar</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.calendarCard}>
                    <Text style={styles.monthLabel}>FEBRUARY 2026</Text>

                    <View style={styles.daysRow}>
                        {days.map((day, i) => (
                            <Text key={i} style={styles.dayInitial}>{day}</Text>
                        ))}
                    </View>

                    <View style={styles.datesRow}>
                        {dates.map((item, i) => (
                            <View key={i} style={styles.dateItem}>
                                <View style={[
                                    styles.dateCircle,
                                    { backgroundColor: item.completed ? P.teal : P.pinkLight }
                                ]}>
                                    <Ionicons
                                        name={item.completed ? "checkmark" : "close"}
                                        size={20}
                                        color={item.completed ? "#FFF" : P.pink}
                                    />
                                </View>
                                <Text style={[
                                    styles.dateText,
                                    { color: item.completed ? P.teal : P.pink }
                                ]}>{item.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <View style={styles.insightIconBg}>
                            <Ionicons name="trending-up" size={24} color={P.amber} />
                        </View>
                        <Text style={styles.insightTitle}>Consistency is Key!</Text>
                    </View>
                    <Text style={styles.insightText}>
                        You've logged your mood for 6 out of the last 7 days. This helps our AI provide much more accurate insights for your wellbeing.
                    </Text>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>Keep it up! 🌿</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: P.bg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: P.card,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    headerTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    calendarCard: {
        backgroundColor: P.card,
        borderRadius: 36,
        padding: 24,
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: P.purpleMid + '33',
        marginBottom: 30,
    },
    monthLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.textSoft,
        letterSpacing: 2,
        marginBottom: 24,
    },
    daysRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    dayInitial: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.textMid,
        width: 32,
        textAlign: 'center',
    },
    datesRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    dateItem: {
        alignItems: 'center',
    },
    dateCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
    },
    insightCard: {
        backgroundColor: P.amberLight,
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: P.amber + '33',
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    insightIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: P.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
    },
    insightText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
        color: P.textMid,
        lineHeight: 22,
        marginBottom: 24,
    },
    actionBtn: {
        backgroundColor: P.amber,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: P.amber,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    actionBtnText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 15,
        color: '#FFF',
    },
});
