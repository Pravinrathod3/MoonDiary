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
    text: '#2D1F3D',
    textMid: '#7A6A8A',
    textSoft: '#B8A8CC',
    amber: '#FBBF24',
    orange: '#F97316',
    blue: '#60A5FA',
    blueLight: '#EFF6FF',
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
                            borderColor: i === 0 ? P.amber : P.pink,
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

export default function AchievementsScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const AchievementBadge = ({ title, icon, color, unlocked = false }: { title: string, icon: any, color: string, unlocked?: boolean }) => (
        <View style={styles.badgeCard}>
            {!unlocked && (
                <View style={styles.lockOverlay}>
                    <Ionicons name="lock-closed" size={24} color={P.textSoft} />
                </View>
            )}
            <View style={[styles.badgeIconBg, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon} size={32} color={color} />
            </View>
            <Text style={styles.badgeTitle}>{title}</Text>
            {unlocked && (
                <View style={styles.unlockedTag}>
                    <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Achievements</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.levelCard}>
                    <View style={styles.levelHeader}>
                        <View style={styles.medalBg}>
                            <Ionicons name="medal" size={40} color={P.amber} />
                        </View>
                        <View>
                            <Text style={styles.levelNum}>Level 4</Text>
                            <Text style={styles.levelTitle}>Master of Mindfulness</Text>
                        </View>
                    </View>

                    <View style={styles.progressArea}>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: '75%' }]} />
                        </View>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressText}>750 XP</Text>
                            <Text style={styles.progressText}>1000 XP</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Badges</Text>

                <View style={styles.badgeGrid}>
                    <AchievementBadge title="7-Day Reflection" icon="calendar" color={P.teal} unlocked={true} />
                    <AchievementBadge title="Stress Control" icon="leaf" color={P.purple} unlocked={true} />
                    <AchievementBadge title="Streak Master" icon="flame" color={P.orange} unlocked={true} />
                    <AchievementBadge title="Early Bird" icon="sunny" color={P.amber} unlocked={false} />
                    <AchievementBadge title="Zen Warrior" icon="body" color={P.pink} unlocked={false} />
                    <AchievementBadge title="Supporter" icon="people" color={P.blue} unlocked={false} />
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
    levelCard: {
        backgroundColor: P.card,
        borderRadius: 36,
        padding: 24,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: P.purpleMid + '33',
        marginBottom: 30,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    medalBg: {
        width: 70,
        height: 70,
        borderRadius: 24,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    levelNum: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24,
        color: P.text,
    },
    levelTitle: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 14,
        color: P.textMid,
        marginTop: 2,
    },
    progressArea: {
        width: '100%',
    },
    progressBarBg: {
        height: 10,
        backgroundColor: P.bg,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: P.amber,
        borderRadius: 5,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    progressText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 11,
        color: P.textSoft,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
        marginBottom: 20,
        paddingLeft: 4,
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    badgeCard: {
        width: (width - 56) / 2,
        backgroundColor: P.card,
        borderRadius: 32,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: P.purpleMid + '22',
        position: 'relative',
        overflow: 'hidden',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeIconBg: {
        width: 64,
        height: 64,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    badgeTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 13,
        color: P.text,
        textAlign: 'center',
    },
    unlockedTag: {
        marginTop: 10,
        backgroundColor: P.tealLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    unlockedText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 10,
        color: P.teal,
        textTransform: 'uppercase',
    },
});
