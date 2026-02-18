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

  const colors = ['#A78BFA', '#5BB8A0', '#818CF8'];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {ripples.map((anim, i) => {
        const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.8] });
        const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.1, 0.04, 0] });
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

export default function WellnessHubScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const CategoryCard = ({ title, icon, color, bg, route, count }: { title: string, icon: any, color: string, bg: string, route: any, count: string }) => (
    <TouchableOpacity
      onPress={() => router.push(route)}
      activeOpacity={0.8}
      style={styles.categoryCard}
    >
      <View style={[styles.categoryIconBg, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.categoryCount}>{count} activities</Text>
      </View>
      <View style={styles.chevronBg}>
        <Ionicons name="chevron-forward" size={16} color={P.textSoft} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
      <RippleBackground />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness Hub</Text>
        <Text style={styles.headerSubtitle}>Nurture your inner peace 🌿</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            Take a moment for yourself. Choose a category below to explore curated wellness activities.
          </Text>
        </View>

        <CategoryCard
          title="Breathing"
          icon="wind"
          color={P.blue}
          bg={P.blueLight}
          route="/wellness/breathing"
          count="12"
        />
        <CategoryCard
          title="Exercises"
          icon="fitness-outline"
          color={P.teal}
          bg={P.tealLight}
          route="/wellness/exercises"
          count="8"
        />
        <CategoryCard
          title="Relaxation Sounds"
          icon="musical-notes-outline"
          color={P.purple}
          bg={P.purpleLight}
          route="/wellness/sounds"
          count="15"
        />
        <CategoryCard
          title="Mindfulness"
          icon="sunny-outline"
          color={P.pink}
          bg={P.pinkLight}
          route="/wellness/index"
          count="10"
        />

        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Ionicons name="sparkles" size={20} color={P.purple} />
            <Text style={styles.recommendationTitle}>Daily Recommendation</Text>
          </View>
          <Text style={styles.recommendationSubject}>"5-min Afternoon Focus Reset"</Text>
          <Text style={styles.recommendationDesc}>
            A quick guided session to clear your mind and boost productivity for the rest of your day.
          </Text>
          <TouchableOpacity style={styles.startBtn} activeOpacity={0.9}>
            <Text style={styles.startBtnText}>Start Now</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 30,
    color: P.text,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: P.textMid,
    marginTop: -4,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  introContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  introText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: P.textMid,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  categoryCard: {
    backgroundColor: P.card,
    borderRadius: 32,
    padding: 18,
    marginBottom: 16,
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
  categoryIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    color: P.text,
  },
  categoryCount: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: P.textSoft,
    marginTop: 2,
  },
  chevronBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: P.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationCard: {
    marginTop: 10,
    backgroundColor: P.purpleLight,
    borderRadius: 36,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: P.purpleMid + '44',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  recommendationTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 14,
    color: P.purple,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recommendationSubject: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: P.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  recommendationDesc: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: P.textMid,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  startBtn: {
    backgroundColor: P.purple,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: P.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: '#FFF',
  },
});