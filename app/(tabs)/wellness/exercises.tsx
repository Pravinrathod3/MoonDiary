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
                            borderColor: i === 0 ? P.teal : P.purple,
                            top: height * 0.15,
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

export default function MindBodyExercisesScreen() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const ExerciseCard = ({ title, icon, tag }: { title: string, icon: any, tag: string }) => (
        <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBg, { backgroundColor: P.tealLight }]}>
                    <Ionicons name={icon} size={24} color={P.teal} />
                </View>
                <View style={styles.titleArea}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardTag}>{tag}</Text>
                </View>
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.metaInfo}>
                    <Ionicons name="time-outline" size={16} color={P.textSoft} />
                    <Text style={styles.metaText}>5-10 mins</Text>
                </View>
                <TouchableOpacity style={styles.exploreBtn} activeOpacity={0.7}>
                    <Text style={styles.exploreBtnText}>Explore</Text>
                    <Ionicons name="chevron-forward" size={14} color="#FFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={P.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mind-Body</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.introContainer}>
                    <Text style={styles.introText}>
                        Physical techniques to improve mental clarity and emotional resilience.
                    </Text>
                </View>

                <ExerciseCard title="Grounding Technique" icon="earth-outline" tag="Anxiety Relief" />
                <ExerciseCard title="Progressive Relaxation" icon="body-outline" tag="Stress Management" />
                <ExerciseCard title="Focus Reset" icon="navigate-outline" tag="Productivity" />
                <ExerciseCard title="Gentle Stretching" icon="fitness-outline" tag="Physical Wellness" />

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
    exerciseCard: {
        backgroundColor: P.card,
        borderRadius: 32,
        padding: 24,
        marginBottom: 16,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: P.purpleMid + '22',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconBg: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    titleArea: {
        flex: 1,
    },
    cardTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
    },
    cardTag: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 11,
        color: P.teal,
        textTransform: 'uppercase',
        marginTop: 2,
        letterSpacing: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 12,
        color: P.textSoft,
    },
    exploreBtn: {
        backgroundColor: P.teal,
        height: 40,
        paddingHorizontal: 20,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    exploreBtnText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 13,
        color: '#FFF',
    },
});
