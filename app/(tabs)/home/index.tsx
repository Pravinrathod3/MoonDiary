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
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
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
    bg: '#FBF7FF',          // soft lavender-white bg
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
            // Pre-seed each ripple at a different phase so they're always visible
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
                const opacity = anim.interpolate({ inputRange: [0, 0.35, 0.7, 1], outputRange: [0.22, 0.12, 0.05, 0] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: width * 0.85,
                            height: width * 0.85,
                            borderRadius: width * 0.425,
                            borderWidth: 2.5,
                            borderColor: colors[i],
                            backgroundColor: fills[i],
                            top: height * 0.15,
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

// ─── Stability Ring ───────────────────────────────────────────────────────────
function StabilityRing({ percent }: { percent: number }) {
    const size = 190;
    const strokeWidth = 13;
    const radius = (size - strokeWidth) / 2;

    const ringColor = percent >= 80 ? P.green : percent >= 60 ? P.amber : P.red;
    const statusText = percent >= 80 ? 'Balanced ✨' : percent >= 60 ? 'Mild Drift Detected' : 'Needs Attention';
    const statusColor = ringColor;

    return (
        <View style={styles.ringContainer}>
            <View style={[styles.ringOuter, { width: size, height: size, borderRadius: size / 2 }]}>
                {/* Track */}
                <View style={{
                    position: 'absolute', width: size, height: size,
                    borderRadius: size / 2, borderWidth: strokeWidth, borderColor: '#F0EAF8',
                }} />
                {/* Dots */}
                {Array.from({ length: 100 }).map((_, i) => {
                    const angle = (i / 100) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const cx = size / 2 + radius * Math.cos(rad) - strokeWidth / 2;
                    const cy = size / 2 + radius * Math.sin(rad) - strokeWidth / 2;
                    const isActive = i < percent;
                    return (
                        <View key={i} style={{
                            position: 'absolute',
                            width: strokeWidth, height: strokeWidth,
                            borderRadius: strokeWidth / 2,
                            backgroundColor: isActive ? ringColor : 'transparent',
                            left: cx, top: cy,
                            opacity: isActive ? (0.35 + (i / 100) * 0.65) : 0,
                        }} />
                    );
                })}
                {/* Center */}
                <View style={styles.ringCenter}>
                    <Text style={[styles.ringPercent, { color: ringColor }]}>{percent}%</Text>
                    <Text style={styles.ringLabel}>Personal Stability</Text>
                    <Text style={[styles.ringStatus, { color: statusColor }]}>{statusText}</Text>
                </View>
            </View>
            <Text style={styles.ringSubtext}>Recovery slightly below load.</Text>
        </View>
    );
}

// ─── Indicator Card ───────────────────────────────────────────────────────────
function IndicatorCard({ icon, label, value, unit, trend, state, color, bg }: {
    icon: any; label: string; value: string; unit?: string;
    trend: 'up' | 'down' | 'neutral'; state: string; color: string; bg: string;
}) {
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendColor = trend === 'up' ? P.green : trend === 'down' ? P.red : P.textSoft;

    return (
        <View style={[styles.indicatorCard, { backgroundColor: bg }]}>
            <View style={[styles.indicatorIconBg, { backgroundColor: color + '28' }]}>
                <Ionicons name={icon} size={17} color={color} />
            </View>
            <Text style={styles.indicatorLabel}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Text style={[styles.indicatorValue, { color: P.text }]}>{value}{unit}</Text>
                <Text style={{ color: trendColor, fontSize: 12, fontWeight: '800' }}>{trendIcon}</Text>
            </View>
            <Text style={[styles.indicatorState, { color }]}>{state}</Text>
        </View>
    );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QuickActionCard({ icon, label, route, bg, iconColor, emoji }: {
    icon: any; label: string; route: string; bg: string; iconColor: string; emoji: string;
}) {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

    return (
        <TouchableOpacity
            onPress={() => router.push(route as any)}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={1}
        >
            <Animated.View style={[styles.quickActionCard, { backgroundColor: bg, transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.quickActionEmoji}>{emoji}</Text>
                <View style={[styles.quickActionIconBg, { backgroundColor: iconColor + '22' }]}>
                    <Ionicons name={icon} size={18} color={iconColor} />
                </View>
                <Text style={[styles.quickActionLabel, { color: iconColor }]}>{label}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

// ─── Recovery Overlay ─────────────────────────────────────────────────────────
function RecoveryOverlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 8 }),
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 8 }),
            ]).start();
            setTimeout(onClose, 3200);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible}>
            <View style={styles.overlayBg}>
                <Animated.View style={[
                    styles.recoveryCard,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
                ]}>
                    <Text style={styles.recoveryEmoji}>🌸</Text>
                    <Text style={styles.recoveryTitle}>Recovery Capacity +3%</Text>
                    <Text style={styles.recoverySubtext}>Load reduced slightly.</Text>
                    <View style={styles.recoveryBar}>
                        <View style={[styles.recoveryBarFill, { width: '63%' }]} />
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, emoji }: { title: string; emoji: string }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>{emoji}</Text>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeDashboard() {
    const router = useRouter();
    const [showRecovery, setShowRecovery] = useState(false);
    const [stabilityScore] = useState(68);

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getSystemStatus = (score: number) => {
        if (score >= 80) return "You're balanced today 🌿";
        if (score >= 60) return 'Your system is slightly strained today.';
        return 'Your system needs some care today.';
    };

    const indicators = [
        { icon: 'compass', label: 'Value Align', value: '72', unit: '%', trend: 'up' as const, state: 'Stable', color: '#A78BFA', bg: '#F5F3FF' },
        { icon: 'moon', label: 'Sleep', value: '6h 12m', unit: '', trend: 'down' as const, state: 'Low', color: '#818CF8', bg: '#EEF2FF' },
        { icon: 'flash', label: 'Stress', value: 'Mod', unit: '', trend: 'up' as const, state: 'Rising', color: '#F472B6', bg: '#FDF2F8' },
        { icon: 'alert-circle', label: 'Triggers', value: '3', unit: '', trend: 'up' as const, state: 'Active', color: '#FB7185', bg: '#FFF1F2' },
        { icon: 'heart', label: 'Recovery', value: '58', unit: '%', trend: 'down' as const, state: 'Lagging', color: '#C084FC', bg: '#FAF5FF' },
        { icon: 'trending-up', label: 'Momentum', value: '71', unit: '%', trend: 'neutral' as const, state: 'Steady', color: '#5BB8A0', bg: '#EDFAF5' },
    ];

    const quickActions = [
        { icon: 'journal-outline', label: 'Journal', route: '/(tabs)/journal', bg: '#FDF2F8', iconColor: '#F472B6', emoji: '📓' },
        { icon: 'stats-chart-outline', label: 'Tracker', route: '/(tabs)/tracker', bg: '#F5F3FF', iconColor: '#A78BFA', emoji: '📊' },
        { icon: 'leaf-outline', label: 'Wellness', route: '/(tabs)/wellness', bg: '#EDFAF5', iconColor: '#5BB8A0', emoji: '🌿' },
        { icon: 'mic-outline', label: 'Companion', route: '/(tabs)/companion', bg: '#EEF2FF', iconColor: '#818CF8', emoji: '🎙️' },
        { icon: 'clipboard-outline', label: 'Assess', route: '/(tabs)/home/questionnaires', bg: '#FFFBEB', iconColor: '#FBBF24', emoji: '📋' },
        { icon: 'person-outline', label: 'Profile', route: '/(tabs)/home/profile', bg: '#FFF1F2', iconColor: '#FB7185', emoji: '✨' },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── 1. Header ── */}
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>{getGreeting()}, Maithili 👋</Text>
                        <Text style={styles.systemStatus}>{getSystemStatus(stabilityScore)}</Text>

                    </View>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/home/profile')} style={styles.avatarBtn}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarEmoji}>🌙</Text>
                        </View>
                        <Text style={styles.avatarLabel}>Identity</Text>
                    </TouchableOpacity>
                </View>

                {/* ── 2. Stability Card ── */}
                <View style={styles.stabilityCard}>
                    <StabilityRing percent={stabilityScore} />
                </View>

                {/* ── 3. Indicators ── */}
                <SectionHeader title="System Indicators" emoji="🔮" />
                <View style={styles.indicatorsGrid}>
                    <View style={styles.indicatorsRow}>
                        {indicators.slice(0, 3).map((ind, i) => (
                            <IndicatorCard key={i} {...ind} />
                        ))}
                    </View>
                    <View style={styles.indicatorsRow}>
                        {indicators.slice(3, 6).map((ind, i) => (
                            <IndicatorCard key={i + 3} {...ind} />
                        ))}
                    </View>
                </View>

                {/* ── 4. Pattern Insight ── */}
                <View style={styles.insightCard}>
                    <View style={styles.insightPill}>
                        <Text style={styles.insightPillText}>✦ Pattern Insight</Text>
                    </View>
                    <Text style={styles.insightText}>
                        Stress rising for 2 days. Recovery lagging behind load.
                    </Text>
                </View>

                {/* ── 5. Intervention Card ── */}
                <View style={styles.interventionCard}>
                    <View style={styles.interventionTop}>
                        <Text style={styles.interventionEmoji}>⚡</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.interventionTitle}>System Overload Detected</Text>
                            <Text style={styles.interventionMeta}>Sleep ↓  ·  Stress ↑</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.interventionBtn}
                        onPress={() => setShowRecovery(true)}
                    >
                        <Text style={styles.interventionBtnText}>Start 2-Min Reset ✨</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Microcopy ── */}
                <Text style={styles.microcopy}>
                    ✦ This score reflects balance between load and recovery.
                </Text>

                <View style={{ height: 28 }} />
            </ScrollView>

            <RecoveryOverlay visible={showRecovery} onClose={() => setShowRecovery(false)} />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: P.bg,
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 10,
    },

    // ── Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    greeting: {
        fontFamily: 'Pacifico_400Regular',
        fontSize: 22,
        color: P.text,
        letterSpacing: -0.2,
    },
    systemStatus: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 13,
        color: P.textMid,
        marginTop: 1,
    },
    avatarBtn: {
        alignItems: 'center',
        marginLeft: 10,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: P.purpleLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: P.purpleMid,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarEmoji: { fontSize: 22 },
    avatarLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 10,
        color: P.purple,
        marginTop: 3,
    },

    // ── Stability Card
    stabilityCard: {
        backgroundColor: P.card,
        borderRadius: 32,
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: P.purpleMid + '44',
    },
    ringContainer: { alignItems: 'center' },
    ringOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    ringCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    ringPercent: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 52,
        letterSpacing: -2,
    },
    ringLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.textMid,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    ringStatus: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        marginTop: 4,
    },
    ringSubtext: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 11,
        color: P.textSoft,
        marginTop: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // ── Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginBottom: 12,
    },
    sectionEmoji: { fontSize: 16 },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: P.text,
        letterSpacing: -0.3,
    },

    // ── Indicators
    indicatorsGrid: {
        gap: 8,
        marginBottom: 20,
    },
    indicatorsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    indicatorCard: {
        borderRadius: 18,
        padding: 10,
        flex: 1,
        shadowColor: '#C084FC',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0E8FF',
    },
    indicatorIconBg: {
        width: 34,
        height: 34,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    indicatorLabel: {
        fontSize: 9,
        color: P.textSoft,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    indicatorValue: {
        fontSize: 13,
        fontWeight: '800',
    },
    indicatorState: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 3,
    },

    // ── Pattern Insight
    insightCard: {
        backgroundColor: P.pinkLight,
        borderRadius: 22,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: P.pinkMid,
        shadowColor: P.pink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
    },
    insightPill: {
        alignSelf: 'flex-start',
        backgroundColor: P.pinkMid,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 10,
    },
    insightPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#BE185D',
        letterSpacing: 0.3,
    },
    insightText: {
        fontSize: 14,
        color: '#831843',
        lineHeight: 21,
        fontWeight: '500',
    },

    // ── Intervention
    interventionCard: {
        backgroundColor: P.text,
        borderRadius: 26,
        padding: 18,
        marginBottom: 14,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 6,
    },
    interventionTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    interventionEmoji: { fontSize: 26 },
    interventionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 3,
    },
    interventionMeta: {
        fontSize: 11.5,
        color: P.purple,
        fontWeight: '600',
    },
    interventionBtn: {
        backgroundColor: P.pink,
        borderRadius: 18,
        paddingVertical: 12,
        alignItems: 'center',
        shadowColor: P.pink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
    },
    interventionBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'center',
    },

    // ── Microcopy
    microcopy: {
        fontSize: 11.5,
        color: P.textSoft,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 22,
        paddingHorizontal: 8,
    },

    // ── Quick Actions Grid
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 6,
    },
    quickActionCard: {
        borderRadius: 24,
        padding: 16,
        width: (width - 46) / 3,
        alignItems: 'center',
        shadowColor: '#C084FC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EDE8FF',
    },
    quickActionEmoji: {
        fontSize: 22,
        marginBottom: 8,
    },
    quickActionIconBg: {
        width: 36,
        height: 36,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    quickActionLabel: {
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'center',
    },

    // ── Recovery Overlay
    overlayBg: {
        flex: 1,
        backgroundColor: 'rgba(45, 31, 61, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recoveryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 34,
        alignItems: 'center',
        width: width * 0.76,
        shadowColor: P.pink,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 12,
        borderWidth: 1.5,
        borderColor: P.pinkMid,
    },
    recoveryEmoji: {
        fontSize: 44,
        marginBottom: 12,
    },
    recoveryTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: P.text,
        textAlign: 'center',
        marginBottom: 6,
    },
    recoverySubtext: {
        fontSize: 13,
        color: P.textMid,
        textAlign: 'center',
        marginBottom: 16,
    },
    recoveryBar: {
        width: '100%',
        height: 6,
        backgroundColor: P.purpleLight,
        borderRadius: 3,
        overflow: 'hidden',
    },
    recoveryBarFill: {
        height: '100%',
        backgroundColor: P.pink,
        borderRadius: 3,
    },
});
