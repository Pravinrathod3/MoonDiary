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

// ─── Palette (Matching Home Screen) ──────────────────────────────────────────
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

  const colors = ['#A78BFA', '#F472B6', '#E879F9'];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {ripples.map((anim, i) => {
        const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 4] });
        const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.12, 0.04, 0] });
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

// ─── Floating Orb ─────────────────────────────────────────────────────────────
function FloatingOrb({ onPress }: { onPress: () => void }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 3000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.orbMainWrapper}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Animated.View style={[
          styles.orbContainer,
          { transform: [{ translateY }, { scale: pulseAnim }] }
        ]}>
          <Animated.View style={[styles.orbRotationLayer, { transform: [{ rotate }] }]}>
            <LinearGradient
              colors={['rgba(167, 139, 250, 0.4)', 'rgba(244, 114, 182, 0.4)', 'rgba(192, 132, 252, 0.4)']}
              style={styles.orbGlass}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.orbRefraction}
          />

          <View style={styles.orbInner}>
            <Ionicons name="mic" size={42} color={P.purple} />
          </View>

          <View style={styles.orbRim} />
          <View style={styles.orbGlow} />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.tapToTalk}>Tap to Talk</Text>
    </View>
  );
}

export default function VoiceCompanionScreen() {
  const router = useRouter();

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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Companion</Text>
        <Text style={styles.headerSubtitle}>I'm here to listen ✨</Text>
      </View>

      <View style={styles.main}>
        <FloatingOrb onPress={() => router.push('/companion/active-session')} />

        <View style={styles.textContainer}>
          <Text style={styles.quote}>"How are you feeling today, Maithili?"</Text>
          <Text style={styles.description}>
            Speak naturally about your day. Your futuristic companion uses AI to analyze your patterns and help you find balance.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconBg}>
            <Ionicons name="sparkles" size={20} color={P.purple} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Pattern Insights</Text>
            <Text style={styles.infoText}>
              Your voice intensity and pace help us detect subtle changes in your stress levels.
            </Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 32,
    color: P.text,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: P.textMid,
    marginTop: -5,
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  orbMainWrapper: {
    alignItems: 'center',
    marginBottom: 50,
  },
  orbContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbRotationLayer: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    overflow: 'hidden',
  },
  orbGlass: {
    width: '100%',
    height: '100%',
  },
  orbRefraction: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: 15,
    right: 15,
    zIndex: 2,
  },
  orbInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: P.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 3,
  },
  orbRim: {
    position: 'absolute',
    width: 174,
    height: 174,
    borderRadius: 87,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 4,
  },
  orbGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: P.purple,
    opacity: 0.1,
    zIndex: -1,
  },
  tapToTalk: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
    color: P.purple,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  quote: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: P.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: P.textMid,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: P.card,
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: P.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: P.purpleMid + '22',
  },
  infoIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: P.purpleLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: P.text,
    marginBottom: 2,
  },
  infoText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: P.textMid,
    lineHeight: 18,
  },
});