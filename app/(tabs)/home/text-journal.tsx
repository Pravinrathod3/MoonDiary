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
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
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
        ripples.forEach((r, i) => animate(r, i * 0.25));
    }, []);

    const colors = ['#A78BFA', '#F472B6', '#5BB8A0'];

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {ripples.map((anim, i) => {
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.6] });
                const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.1, 0.04, 0] });
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

export default function TextJournalScreen() {
    const router = useRouter();
    const [text, setText] = useState('');

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
            <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
            <RippleBackground />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={P.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Journaling</Text>
                    <TouchableOpacity style={styles.draftBtn}>
                        <Text style={styles.draftText}>Draft</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputCard}>
                        <TextInput
                            multiline
                            placeholder="What's on your mind today?"
                            placeholderTextColor={P.textSoft}
                            style={styles.textInput}
                            value={text}
                            onChangeText={setText}
                            autoFocus
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.analyzeBtn}>
                        <Ionicons name="sparkles" size={18} color={P.purple} style={{ marginRight: 8 }} />
                        <Text style={styles.analyzeText}>Analyze Emotion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.saveText}>Save Entry</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    draftBtn: {
        backgroundColor: P.purpleLight,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 14,
    },
    draftText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 12,
        color: P.purple,
    },
    scrollContent: {
        paddingHorizontal: 20,
        flexGrow: 1,
    },
    inputCard: {
        backgroundColor: P.card,
        borderRadius: 32,
        padding: 24,
        flex: 1,
        minHeight: height * 0.4,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1.5,
        borderColor: P.purpleMid + '33',
        marginBottom: 20,
    },
    textInput: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 18,
        color: P.text,
        lineHeight: 28,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 24,
        flexDirection: 'row',
        gap: 12,
        backgroundColor: P.bg,
    },
    analyzeBtn: {
        flex: 1,
        backgroundColor: P.card,
        borderColor: P.purpleMid,
        borderWidth: 1.5,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    analyzeText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 14,
        color: P.purple,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: P.purple,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        shadowColor: P.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 14,
        color: '#FFF',
    },
});
