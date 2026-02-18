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
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ─── Palette (Dark Immersive) ────────────────────────────────────────────────
const P = {
    bg: '#1A1423',
    card: '#2D2338',
    pink: '#F472B6',
    purple: '#A78BFA',
    teal: '#5BB8A0',
    white: '#FFFFFF',
    textSoft: '#B8A8CC',
    textMid: '#7A6A8A',
};

// ─── Ripple Background (More Prominent for Active Session) ────────────────────
function RippleBackground() {
    const ripples = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        const animate = (anim: Animated.Value, startAt: number) => {
            anim.setValue(startAt);
            Animated.loop(
                Animated.timing(anim, { toValue: 1, duration: 4000, useNativeDriver: true })
            ).start();
        };
        ripples.forEach((r, i) => animate(r, i * 0.33));
    }, []);

    const colors = ['#E879F9', '#A78BFA', '#818CF8'];

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 4.5] });
                const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.25, 0.1, 0] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: width * 0.9,
                            height: width * 0.9,
                            borderRadius: width * 0.45,
                            borderWidth: 3,
                            borderColor: colors[i],
                            top: height * 0.15,
                            left: width * 0.05,
                            transform: [{ scale }],
                            opacity,
                        }}
                    />
                );
            })}
        </View>
    );
}

// ─── Active Orb (Pulsing to "Voice") ──────────────────────────────────────────
function ActiveOrb() {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.orbWrapper}>
            <Animated.View style={[styles.orbOuter, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient
                    colors={[P.pink, P.purple]}
                    style={styles.orb}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="mic" size={40} color="#FFF" />
                </LinearGradient>
            </Animated.View>
            <View style={styles.waveContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <WaveBar key={i} index={i} />
                ))}
            </View>
        </View>
    );
}

function WaveBar({ index }: { index: number }) {
    const heightAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(heightAnim, { toValue: Math.random() * 50 + 20, duration: 200 + index * 50, useNativeDriver: false }),
                Animated.timing(heightAnim, { toValue: 20, duration: 200 + index * 50, useNativeDriver: false }),
            ]).start(() => animate());
        };
        animate();
    }, []);

    return <Animated.View style={[styles.waveBar, { height: heightAnim }]} />;
}

export default function ActiveSessionScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={P.bg} />
            <RippleBackground />

            <View style={styles.header}>
                <View style={styles.listeningIndicator}>
                    <View style={styles.dot} />
                    <Text style={styles.listeningText}>Listening...</Text>
                </View>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={P.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.main}>
                <ActiveOrb />

                <View style={styles.transcriptionBox}>
                    <Text style={styles.transcriptionLabel}>TRANSCRIPTION PREVIEW</Text>
                    <Text style={styles.transcriptionText}>
                        "I've been thinking about the presentation tomorrow and feel slightly anxious... but I know I'm prepared."
                    </Text>
                </View>

                <View style={styles.patternNotice}>
                    <Ionicons name="analytics-outline" size={16} color={P.textSoft} />
                    <Text style={styles.patternText}>Tone Analysis: Calm but Alert</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => router.push('/companion/summary')}
                    style={styles.endBtn}
                >
                    <Text style={styles.endBtnText}>End Session</Text>
                </TouchableOpacity>
            </View>
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
    },
    listeningIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: P.teal,
        marginRight: 8,
    },
    listeningText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.white,
        textTransform: 'uppercase',
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    orbWrapper: {
        alignItems: 'center',
        marginBottom: 60,
    },
    orbOuter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orb: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: P.pink,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    waveContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
        height: 60,
        marginTop: 20,
    },
    waveBar: {
        width: 5,
        backgroundColor: P.purple,
        borderRadius: 3,
        opacity: 0.6,
    },
    transcriptionBox: {
        width: '100%',
        alignItems: 'center',
    },
    transcriptionLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 11,
        color: P.textSoft,
        letterSpacing: 2,
        marginBottom: 16,
    },
    transcriptionText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 22,
        color: P.white,
        textAlign: 'center',
        lineHeight: 30,
    },
    patternNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 40,
        gap: 8,
    },
    patternText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 13,
        color: P.textSoft,
    },
    footer: {
        padding: 40,
    },
    endBtn: {
        backgroundColor: P.white,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    endBtnText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.bg,
    },
});
