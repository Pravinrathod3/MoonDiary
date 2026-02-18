import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
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
    pinkMid: '#FBCFE8',
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
    green: '#4CAF88',
    red: '#F87171',
};

// ─── Ripple Background ────────────────────────────────────────────────────────
function RippleBackground() {
    const ripples = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
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
        ripples.forEach((r, i) => animate(r, i * 0.25));
    }, []);

    const colors = ['#E879F9', '#A78BFA', '#F472B6', '#818CF8'];
    const fills = ['#E879F922', '#A78BFA18', '#F472B61A', '#818CF815'];

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.6] });
                const opacity = anim.interpolate({ inputRange: [0, 0.35, 0.7, 1], outputRange: [0.12, 0.08, 0.04, 0] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: width * 0.85,
                            height: width * 0.85,
                            borderRadius: width * 0.425,
                            borderWidth: 2,
                            borderColor: colors[i],
                            backgroundColor: fills[i],
                            top: height * 0.1,
                            left: width * 0.075,
                            transform: [{ scale }],
                            opacity,
                        }}
                    />
                );
            })}
        </View>
    );
}

export default function EntryDetailScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const StatRow = ({ label, value, color, icon }: { label: string, value: number, color: string, icon: any }) => (
        <View style={styles.statRow}>
            <View style={styles.statInfo}>
                <Ionicons name={icon} size={16} color={color} style={{ marginRight: 8 }} />
                <Text style={styles.statLabel}>{label}</Text>
            </View>
            <View style={styles.statBarContainer}>
                <View style={styles.statBarBg}>
                    <View style={[styles.statBarFill, { width: `${value}%`, backgroundColor: color }]} />
                </View>
                <Text style={[styles.statValue, { color }]}>{value}%</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Entry Details</Text>
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={P.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>February 16, 2026</Text>
                    </View>
                    <Text style={styles.title}>Productive Monday ✨</Text>

                    <View style={styles.moodSection}>
                        <View style={[styles.moodEmojiBg, { backgroundColor: P.tealLight }]}>
                            <Text style={styles.moodEmoji}>✨</Text>
                        </View>
                        <View>
                            <Text style={styles.moodStatus}>Feeling Positive</Text>
                            <Text style={styles.moodSubtext}>Balanced Energy</Text>
                        </View>
                    </View>

                    <Text style={styles.content}>
                        Today was quite a productive day at work, but I'm feeling a bit overwhelmed by the upcoming deadline.
                        I managed to finish all my tasks ahead of schedule, which gave me some breathing room.
                        I also had a great conversation with Sarah about the new project.
                        I'm feeling positive but definitely need to find a way to manage the stress as the week progresses.
                    </Text>
                </View>

                {/* Analysis Section */}
                <View style={[styles.card, { marginTop: 20 }]}>
                    <Text style={styles.sectionTitle}>System Analysis</Text>
                    <Text style={styles.sectionSubtitle}>Detected state based on your entry</Text>

                    <View style={styles.statsContainer}>
                        <StatRow label="Stress Level" value={65} color={P.pink} icon="flash" />
                        <StatRow label="Mental Calm" value={45} color={P.purple} icon="leaf" />
                        <StatRow label="Positivity" value={80} color={P.teal} icon="heart" />
                    </View>
                </View>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>DAILY RATING</Text>
                    <View style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <Ionicons key={i} name="star" size={36} color={i < 4 ? P.amber : P.purpleLight} style={{ marginHorizontal: 4 }} />
                        ))}
                    </View>
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
        paddingBottom: 15,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: P.card,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    moreBtn: {
        width: 44,
        height: 44,
        borderRadius: 15,
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
        paddingTop: 10,
    },
    card: {
        backgroundColor: P.card,
        borderRadius: 32,
        padding: 24,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: P.purpleMid + '44',
    },
    dateBadge: {
        alignSelf: 'flex-start',
        backgroundColor: P.purpleLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    dateText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 11,
        color: P.purple,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    title: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 26,
        color: P.text,
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    moodSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: P.bg,
        padding: 12,
        borderRadius: 20,
    },
    moodEmojiBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    moodEmoji: {
        fontSize: 22,
    },
    moodStatus: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 15,
        color: P.text,
    },
    moodSubtext: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 12,
        color: P.textMid,
    },
    content: {
        fontFamily: 'Nunito_400Regular',
        fontSize: 16,
        color: P.textMid,
        lineHeight: 26,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 13,
        color: P.textSoft,
        marginBottom: 20,
    },
    statsContainer: {
        gap: 16,
    },
    statRow: {
        flexDirection: 'column',
        gap: 8,
    },
    statInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 14,
        color: P.textMid,
    },
    statBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statBarBg: {
        flex: 1,
        height: 10,
        backgroundColor: P.bg,
        borderRadius: 5,
        overflow: 'hidden',
    },
    statBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    statValue: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 13,
        width: 40,
        textAlign: 'right',
    },
    ratingContainer: {
        marginTop: 30,
        alignItems: 'center',
        padding: 20,
    },
    ratingLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.textSoft,
        letterSpacing: 2,
        marginBottom: 16,
    },
    stars: {
        flexDirection: 'row',
    },
});
