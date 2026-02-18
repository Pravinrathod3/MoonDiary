import {
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
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
                            borderColor: i === 0 ? P.blue : P.purple,
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

// ─── Visual Breathing Component ───────────────────────────────────────────────
interface BreathingModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    inhale: number;
    hold: number;
    exhale: number;
}

function BreathingVisualModal({ visible, onClose, title, inhale, hold, exhale }: BreathingModalProps) {
    const breatheAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            startBreathingCycle();
        } else {
            breatheAnim.stopAnimation();
        }
    }, [visible]);

    const startBreathingCycle = () => {
        Animated.sequence([
            // INHALE
            Animated.timing(breatheAnim, {
                toValue: 1,
                duration: inhale * 1000,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            }),
            // HOLD
            Animated.delay(hold * 1000),
            // EXHALE
            Animated.timing(breatheAnim, {
                toValue: 0,
                duration: exhale * 1000,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) startBreathingCycle();
        });
    };

    const [timerPhase, setTimerPhase] = useState('Inhale');
    useEffect(() => {
        if (!visible) return;

        let inhaleTimer: any;
        let holdTimer: any;
        let exhaleTimer: any;

        const runTimers = () => {
            setTimerPhase('Inhale');
            inhaleTimer = setTimeout(() => {
                setTimerPhase('Hold');
                holdTimer = setTimeout(() => {
                    setTimerPhase('Exhale');
                    exhaleTimer = setTimeout(runTimers, exhale * 1000);
                }, hold * 1000);
            }, inhale * 1000);
        };

        runTimers();
        return () => {
            clearTimeout(inhaleTimer);
            clearTimeout(holdTimer);
            clearTimeout(exhaleTimer);
        };
    }, [visible, inhale, hold, exhale]);

    // Multiple ripple scales for the "liquid filling" effect
    const ripple1Scale = breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 1],
    });
    const ripple2Scale = breatheAnim.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0.2, 0.3, 1.1],
    });
    const ripple3Scale = breatheAnim.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0.2, 0.4, 1.2],
    });

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <RippleBackground />

                <TouchableOpacity style={styles.closeModal} onPress={onClose}>
                    <Ionicons name="close-circle" size={48} color={P.textMid} />
                </TouchableOpacity>

                <View style={styles.breathingMain}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <View style={styles.visualContainer}>
                        {/* Static Outer Border */}
                        <View style={styles.breathingCircleOutline} />

                        {/* Liquid Ripples Filling Effect */}
                        <Animated.View style={[
                            styles.breathingRipple,
                            { transform: [{ scale: ripple3Scale }], opacity: 0.15, backgroundColor: P.purple }
                        ]} />
                        <Animated.View style={[
                            styles.breathingRipple,
                            { transform: [{ scale: ripple2Scale }], opacity: 0.25, backgroundColor: P.blue }
                        ]} />

                        {/* Main Fill Circle */}
                        <Animated.View style={[
                            styles.breathingFill,
                            {
                                transform: [{ scale: ripple1Scale }],
                                opacity: Animated.add(0.4, Animated.multiply(breatheAnim, 0.4))
                            }
                        ]}>
                            <LinearGradient
                                colors={[P.blue, P.purple]}
                                style={styles.breathingGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                        </Animated.View>

                        {/* Text Overlay */}
                        <View style={styles.centerTextContainer}>
                            <Text style={styles.phaseText}>{timerPhase}</Text>
                        </View>
                    </View>

                    <View style={styles.rhythmInfo}>
                        <View style={styles.rhythmItem}>
                            <Text style={styles.rhythmVal}>{inhale}s</Text>
                            <Text style={styles.rhythmLab}>Inhale</Text>
                        </View>
                        <View style={styles.rhythmDot} />
                        <View style={styles.rhythmItem}>
                            <Text style={styles.rhythmVal}>{hold}s</Text>
                            <Text style={styles.rhythmLab}>Hold</Text>
                        </View>
                        <View style={styles.rhythmDot} />
                        <View style={styles.rhythmItem}>
                            <Text style={styles.rhythmVal}>{exhale}s</Text>
                            <Text style={styles.rhythmLab}>Exhale</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function BreathingExercisesScreen() {
    const router = useRouter();
    const [selectedExercise, setSelectedExercise] = useState<null | {
        title: string, inhale: number, hold: number, exhale: number
    }>(null);

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) return null;

    const ExerciseItem = ({ title, duration, type, rhythm }: {
        title: string, duration: string, type: string, rhythm: [number, number, number]
    }) => (
        <TouchableOpacity
            style={styles.exerciseCard}
            activeOpacity={0.8}
            onPress={() => setSelectedExercise({ title, inhale: rhythm[0], hold: rhythm[1], exhale: rhythm[2] })}
        >
            <View style={styles.exerciseIconBg}>
                <Ionicons name="leaf-outline" size={24} color={P.blue} />
            </View>
            <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{title}</Text>
                <View style={styles.exerciseMeta}>
                    <Text style={styles.exerciseDuration}>{duration}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.exerciseType}>{type}</Text>
                </View>
            </View>
            <View style={styles.playBtn}>
                <Ionicons name="play" size={16} color="#FFF" />
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
                <Text style={styles.headerTitle}>Breathing</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.heroWrapper}
                    onPress={() => setSelectedExercise({ title: 'Calm Reset', inhale: 4, hold: 2, exhale: 6 })}
                >
                    <LinearGradient
                        colors={[P.blueLight, '#BAE6FD']}
                        style={styles.heroCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.heroIconBg}>
                            <Ionicons name="infinite" size={32} color={P.blue} />
                        </View>
                        <Text style={[styles.heroTitle, { color: P.text }]}>3-min Calm Reset</Text>
                        <Text style={[styles.heroDesc, { color: P.textMid }]}>A quick session to regulate your heart rate and settle your mind. (4s-2s-6s)</Text>
                        <View style={styles.heroCircleBtn}>
                            <Ionicons name="play" size={28} color="#FFF" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Library</Text>

                <ExerciseItem title="Box Breathing" duration="4 mins" type="Focus" rhythm={[4, 4, 4]} />
                <ExerciseItem title="Stress Relief" duration="5 mins" type="Calm" rhythm={[4, 2, 7]} />
                <ExerciseItem title="Deep Sleep Prep" duration="10 mins" type="Sleep" rhythm={[4, 7, 8]} />
                <ExerciseItem title="Morning Energy" duration="3 mins" type="Vitality" rhythm={[6, 0, 4]} />

                <View style={{ height: 40 }} />
            </ScrollView>

            <BreathingVisualModal
                visible={!!selectedExercise}
                onClose={() => setSelectedExercise(null)}
                title={selectedExercise?.title || ''}
                inhale={selectedExercise?.inhale || 4}
                hold={selectedExercise?.hold || 2}
                exhale={selectedExercise?.exhale || 6}
            />
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
    heroWrapper: {
        marginBottom: 30,
    },
    heroCard: {
        borderRadius: 36,
        padding: 30,
        alignItems: 'center',
        shadowColor: P.blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    heroIconBg: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 22,
        marginBottom: 8,
    },
    heroDesc: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    heroCircleBtn: {
        backgroundColor: P.blue,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: P.blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    sectionTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 18,
        color: P.text,
        marginBottom: 16,
        paddingLeft: 4,
    },
    exerciseCard: {
        backgroundColor: P.card,
        borderRadius: 28,
        padding: 16,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: P.purpleMid + '22',
    },
    exerciseIconBg: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: P.blueLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: P.text,
    },
    exerciseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    exerciseDuration: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 12,
        color: P.textSoft,
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: P.textSoft,
        marginHorizontal: 8,
    },
    exerciseType: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 11,
        color: P.blue,
        textTransform: 'uppercase',
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: P.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ─── Modal Styles ───
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(251, 247, 255, 0.98)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeModal: {
        position: 'absolute',
        top: 60,
        right: 25,
        zIndex: 10,
    },
    breathingMain: {
        alignItems: 'center',
        width: '100%',
    },
    modalTitle: {
        fontFamily: 'Pacifico_400Regular',
        fontSize: 32,
        color: P.text,
        marginBottom: 80,
    },
    visualContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
    },
    breathingCircleOutline: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: P.blueLight,
        backgroundColor: 'transparent',
    },
    breathingRipple: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    breathingFill: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: P.blue,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    breathingGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    centerTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 24,
        color: '#FFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    rhythmInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    rhythmItem: {
        alignItems: 'center',
    },
    rhythmVal: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 20,
        color: P.text,
    },
    rhythmLab: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 12,
        color: P.textMid,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    rhythmDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: P.purpleMid,
    }
});
