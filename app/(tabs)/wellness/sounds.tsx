import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
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
    blue: '#60A5FA',
    blueLight: '#EFF6FF',
    amber: '#FBBF24',
    orange: '#F97316',
};

const SOUNDS = [
    { id: '1', title: 'Rain', icon: 'rainy-outline', color: P.blue, bg: P.blueLight, rippleColors: ['#3B82F6', '#06B6D4', '#2563EB', '#60A5FA', '#93C5FD'] },
    { id: '2', title: 'Fireplace', icon: 'flame-outline', color: P.orange, bg: '#FFF7ED', rippleColors: ['#F97316', '#EF4444', '#FCD34D', '#FB923C', '#FCA5A5'] },
    { id: '3', title: 'Ocean Waves', icon: 'water-outline', color: '#6366f1', bg: '#EEF2FF', rippleColors: ['#4F46E5', '#3B82F6', '#10B981', '#6366F1', '#818CF8'] },
    { id: '4', title: 'Forest Birds', icon: 'leaf-outline', color: P.teal, bg: P.tealLight, rippleColors: ['#10B981', '#059669', '#84CC16', '#34D399', '#6EE7B7'] },
    { id: '5', title: 'White Noise', icon: 'radio-outline', color: P.textMid, bg: '#F9FAFB', rippleColors: ['#64748B', '#475569', '#94A3B8', '#94A3B8', '#CBD5E1'] },
    { id: '6', title: 'Thunderstorm', icon: 'thunderstorm-outline', color: P.purple, bg: P.purpleLight, rippleColors: ['#8B5CF6', '#D946EF', '#4F46E5', '#A78BFA', '#C084FC'] },
];

// ─── Ripple Background ────────────────────────────────────────────────────────
function RippleBackground({ activeColors }: { activeColors: string[] }) {
    const ripples = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        const animate = (anim: Animated.Value, startAt: number) => {
            anim.setValue(startAt);
            Animated.loop(
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 5000, // Faster for more flow
                    useNativeDriver: true
                })
            ).start();
        };
        ripples.forEach((r, i) => animate(r, i * 0.2)); // Staggered by 20%
    }, []);

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 4.5] });
                const opacity = anim.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [0, 0.35, 0.15, 0]
                });
                const color = activeColors[i % activeColors.length];
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: width * 1,
                            height: width * 1,
                            borderRadius: width * 0.5,
                            borderWidth: 6,
                            borderColor: color,
                            top: height * 0.05,
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

export default function RelaxationSoundsScreen() {
    const router = useRouter();
    const [playingId, setPlayingId] = useState<string | null>(null);

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const activeSound = SOUNDS.find(s => s.id === playingId);
    const activeColors = activeSound ? activeSound.rippleColors : [P.purple, P.blue, P.pink];

    const SoundCard = ({ item }: { item: typeof SOUNDS[0] }) => {
        const isPlaying = playingId === item.id;
        return (
            <TouchableOpacity
                onPress={() => setPlayingId(isPlaying ? null : item.id)}
                activeOpacity={0.8}
                style={[
                    styles.soundCard,
                    isPlaying && { borderColor: item.color, borderWidth: 2, shadowColor: item.color, shadowOpacity: 0.15 }
                ]}
            >
                <View style={[styles.soundIconBg, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={styles.soundTitle}>{item.title}</Text>
                <View style={[
                    styles.playBtn,
                    { backgroundColor: isPlaying ? item.color : P.bg }
                ]}>
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={18}
                        color={isPlaying ? "#FFF" : P.textSoft}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground activeColors={activeColors} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Relaxation Sounds</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.introContainer}>
                    <Text style={styles.introText}>
                        Immersive soundscapes to help you focus, sleep, or meditate.
                    </Text>
                    {activeSound && (
                        <View style={styles.activeLabel}>
                            <Text style={[styles.activeLabelText, { color: activeColors[0] }]}>
                                Now Playing: {activeSound.title}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.grid}>
                    {SOUNDS.map((item) => <SoundCard key={item.id} item={item} />)}
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
    introContainer: {
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    introText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
        color: P.textMid,
        textAlign: 'center',
        lineHeight: 22,
    },
    activeLabel: {
        marginTop: 10,
        alignItems: 'center',
    },
    activeLabelText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    soundCard: {
        width: (width - 56) / 2,
        backgroundColor: P.card,
        borderRadius: 32,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1.5,
        borderColor: P.purpleMid + '22',
    },
    soundIconBg: {
        width: 64,
        height: 64,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    soundTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: P.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    playBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
