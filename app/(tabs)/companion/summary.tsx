import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
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
    amber: '#f59e0b',
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
                            borderColor: i === 0 ? P.purple : P.pink,
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

export default function SessionSummaryScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const EmotionBadge = ({ label, color, bg }: { label: string, color: string, bg: string }) => (
        <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color: color }]}>{label}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/companion')} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Session Result</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>TOTAL DURATION</Text>
                    <Text style={styles.heroValue}>04:12</Text>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStats}>
                        <View style={styles.heroStatItem}>
                            <Text style={styles.heroStatLabel}>Words</Text>
                            <Text style={styles.heroStatValue}>542</Text>
                        </View>
                        <View style={styles.heroStatDivider} />
                        <View style={styles.heroStatItem}>
                            <Text style={styles.heroStatLabel}>Pace</Text>
                            <Text style={styles.heroStatValue}>Steady</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Emotions Detected</Text>
                <View style={styles.badgeContainer}>
                    <EmotionBadge label="Mild Stress" color={P.pink} bg={P.pinkLight} />
                    <EmotionBadge label="Anxiety" color="#F97316" bg="#FFF7ED" />
                    <EmotionBadge label="Reflection" color={P.purple} bg={P.purpleLight} />
                </View>

                <View style={[styles.suggestionCard, { backgroundColor: P.card }]}>
                    <LinearGradient
                        colors={[P.teal, '#34D399']}
                        style={styles.suggestionHeader}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="sparkles" size={18} color="#FFF" />
                        <Text style={styles.suggestionTitle}>Companion Suggestion</Text>
                    </LinearGradient>
                    <View style={styles.suggestionBody}>
                        <Text style={styles.suggestionText}>
                            Based on your anxiety levels about tomorrow's presentation, try a 3-minute box breathing exercise to calm your nervous system.
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/wellness/breathing')}
                            style={styles.actionBtn}
                        >
                            <Text style={styles.actionBtnText}>Start Reset Exercise</Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/companion')}
                    style={styles.doneBtn}
                >
                    <Text style={styles.doneBtnText}>Return to Companion</Text>
                </TouchableOpacity>

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
    heroCard: {
        backgroundColor: P.card,
        borderRadius: 36,
        padding: 30,
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: P.purpleMid + '33',
        marginBottom: 30,
    },
    heroLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.textSoft,
        letterSpacing: 2,
        marginBottom: 10,
    },
    heroValue: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 48,
        color: P.text,
        marginBottom: 20,
    },
    heroDivider: {
        width: '100%',
        height: 1,
        backgroundColor: P.purpleLight,
        marginBottom: 20,
    },
    heroStats: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    heroStatItem: {
        alignItems: 'center',
    },
    heroStatLabel: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 12,
        color: P.textSoft,
        marginBottom: 4,
    },
    heroStatValue: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
    },
    heroStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: P.purpleLight,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
        marginBottom: 16,
        paddingLeft: 4,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 30,
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
    },
    badgeText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 13,
    },
    suggestionCard: {
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 4,
        borderWidth: 1,
        borderColor: P.purpleMid + '22',
        marginBottom: 40,
    },
    suggestionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
    },
    suggestionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 14,
        color: '#FFF',
    },
    suggestionBody: {
        padding: 24,
    },
    suggestionText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        color: P.textMid,
        lineHeight: 24,
        marginBottom: 24,
    },
    actionBtn: {
        backgroundColor: P.teal,
        height: 54,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    actionBtnText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 15,
        color: '#FFF',
    },
    doneBtn: {
        backgroundColor: P.text,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneBtnText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    },
});
