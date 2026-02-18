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
    text: '#2D1F3D',
    textMid: '#7A6A8A',
    textSoft: '#B8A8CC',
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
        ripples.forEach((r, i) => animate(r, i * 0.33));
    }, []);

    const colors = ['#A78BFA', '#F472B6', '#5BB8A0'];

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.8] });
                const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.12, 0.05, 0] });
                return (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: width * 0.9,
                            height: width * 0.9,
                            borderRadius: width * 0.45,
                            borderWidth: 2,
                            borderColor: colors[i],
                            top: height * 0.2,
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

export default function AddJournalScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const JournalOption = ({ title, desc, icon, color, onPress, emoji }: { title: string, desc: string, icon: any, color: string, onPress: () => void, emoji: string }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;
        const pressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
        const pressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

        return (
            <TouchableOpacity
                onPress={onPress}
                onPressIn={pressIn}
                onPressOut={pressOut}
                activeOpacity={1}
            >
                <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={[styles.optionIconBg, { backgroundColor: color + '22' }]}>
                        <Ionicons name={icon} size={36} color={color} />
                    </View>
                    <View style={styles.optionContent}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>{title}</Text>
                            <Text style={styles.optionEmoji}>{emoji}</Text>
                        </View>
                        <Text style={styles.optionDesc}>{desc}</Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Entry</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.mainTitle}>How would you like{'\n'}to express yourself?</Text>
                <Text style={styles.subtitle}>Choose your preferred way to record today's journey.</Text>

                <View style={styles.optionsList}>
                    <JournalOption
                        title="Text Journal"
                        desc="Write down your thoughts, stories, and reflections in your own pace."
                        icon="document-text-outline"
                        color={P.purple}
                        emoji="✍️"
                        onPress={() => router.push('/home/text-journal')}
                    />

                    <JournalOption
                        title="Voice Journal"
                        desc="Speak freely and let your voice be heard. We'll transcribe it for you."
                        icon="mic-outline"
                        color={P.teal}
                        emoji="🎙️"
                        onPress={() => router.push('/home/voice-journal')}
                    />

                    <View style={styles.comingSoon}>
                        <Ionicons name="sparkles-outline" size={16} color={P.textSoft} style={{ marginRight: 6 }} />
                        <Text style={styles.comingSoonText}>Video entries coming soon</Text>
                    </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    mainTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 28,
        color: P.text,
        lineHeight: 34,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
        color: P.textMid,
        marginBottom: 40,
    },
    optionsList: {
        gap: 20,
    },
    card: {
        backgroundColor: P.card,
        borderRadius: 32,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1.5,
        borderColor: P.purpleMid + '33',
    },
    optionIconBg: {
        width: 70,
        height: 70,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    optionContent: {
        flex: 1,
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    optionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
    },
    optionEmoji: {
        fontSize: 18,
    },
    optionDesc: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 13,
        color: P.textMid,
        lineHeight: 18,
    },
    comingSoon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    comingSoonText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 12,
        color: P.textSoft,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
