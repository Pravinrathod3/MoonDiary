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
    bg: '#1A1423',          // deep dark background for voice mode
    card: '#2D2338',
    pink: '#F472B6',
    purple: '#A78BFA',
    teal: '#5BB8A0',
    white: '#FFFFFF',
    textSoft: '#B8A8CC',
    textMid: '#7A6A8A',
};

// ─── Ripple Background ────────────────────────────────────────────────────────
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
                Animated.timing(anim, { toValue: 1, duration: 6500, useNativeDriver: true })
            ).start();
        };
        ripples.forEach((r, i) => animate(r, i * 0.25));
    }, []);

    const colors = ['#E879F9', '#A78BFA', '#818CF8'];

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.8] });
                const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.3, 0.1, 0] });
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
                            top: height * 0.1,
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

export default function VoiceJournalScreen() {
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
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
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={P.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Voice Reflection</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.main}>
                <View style={styles.micSection}>
                    <Animated.View style={[
                        styles.micOuter,
                        { transform: [{ scale: pulseAnim }], opacity: isRecording ? 1 : 0.6 }
                    ]}>
                        <TouchableOpacity
                            onPress={() => setIsRecording(!isRecording)}
                            style={[
                                styles.micInner,
                                { backgroundColor: isRecording ? P.pink : P.purple }
                            ]}
                            activeOpacity={0.8}
                        >
                            <Ionicons name={isRecording ? "stop" : "mic"} size={48} color={P.white} />
                        </TouchableOpacity>
                    </Animated.View>
                    <Text style={[styles.statusText, { color: isRecording ? P.pink : P.purple }]}>
                        {isRecording ? "Recording..." : "Start Recording"}
                    </Text>
                    {isRecording && <Text style={styles.timer}>00:42</Text>}
                </View>

                <View style={styles.transcriptCard}>
                    <View style={styles.transcriptHeader}>
                        <Text style={styles.transcriptLabel}>LIVE TRANSCRIPT</Text>
                        {isRecording && <View style={styles.pulseDot} />}
                    </View>
                    <ScrollView style={styles.transcriptScroll} showsVerticalScrollIndicator={false}>
                        <Text style={styles.transcriptText}>
                            {isRecording
                                ? "Today was quite a productive day at work, but I'm feeling a bit overwhelmed by the upcoming deadline. I need to find a way to balance the load and recover properly..."
                                : "Tap the microphone to share your thoughts and feelings. Your words will appear here as you speak."
                            }
                        </Text>
                    </ScrollView>

                    {isRecording && (
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.pauseBtn]}
                                onPress={() => setIsRecording(false)}
                            >
                                <Text style={styles.actionBtnText}>Pause</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.saveBtn]}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.actionBtnText}>Stop & Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
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
        paddingBottom: 20,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.white,
    },
    main: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    micSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    micOuter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    micInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    statusText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        marginBottom: 8,
    },
    timer: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 16,
        color: P.textSoft,
    },
    transcriptCard: {
        backgroundColor: P.card,
        marginHorizontal: 20,
        borderRadius: 32,
        padding: 24,
        height: height * 0.35,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    transcriptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    transcriptLabel: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 11,
        color: P.textSoft,
        letterSpacing: 2,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: P.pink,
    },
    transcriptScroll: {
        flex: 1,
    },
    transcriptText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 17,
        color: P.white,
        lineHeight: 26,
        opacity: 0.9,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
    },
    pauseBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    saveBtn: {
        backgroundColor: P.pink,
    },
    actionBtnText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 14,
        color: P.white,
    },
});
