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
  amber: '#FBBF24',
  amberLight: '#FFFBEB',
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

export default function TrackerDashboard() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const HabitItem = ({ title, icon, value, color, bg }: { title: string, icon: any, value: string, color: string, bg: string }) => (
    <View style={styles.habitCard}>
      <View style={[styles.habitIconBg, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.habitInfo}>
        <Text style={styles.habitTitle}>{title}</Text>
        <Text style={styles.habitValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={P.textSoft} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
      <RippleBackground />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracker</Text>
        <Text style={styles.headerSubtitle}>Keep the momentum 🔥</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => router.push('/tracker/streak')}
          activeOpacity={0.9}
          style={styles.streakCardWrapper}
        >
          <LinearGradient
            colors={[P.amber, '#F59E0B']}
            style={styles.streakCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.streakIconWrapper}>
              <Ionicons name="flame" size={32} color="#FFF" />
            </View>
            <Text style={styles.streakCount}>5 Days</Text>
            <Text style={styles.streakLabel}>CURRENT STREAK</Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>Doing Great! 🌿</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tracked Habits</Text>
          <TouchableOpacity onPress={() => router.push('/tracker/rewards')}>
            <Text style={styles.viewRewards}>View Rewards</Text>
          </TouchableOpacity>
        </View>

        <HabitItem title="Mood Logs" icon="happy-outline" value="12/30" color={P.amber} bg={P.amberLight} />
        <HabitItem title="Sleep Logs" icon="moon-outline" value="28/30" color={P.purple} bg={P.purpleLight} />
        <HabitItem title="Stress Logs" icon="flash-outline" value="15/30" color={P.pink} bg={P.pinkLight} />
        <HabitItem title="Consistency" icon="calendar-outline" value="85%" color={P.teal} bg={P.tealLight} />

        <TouchableOpacity
          onPress={() => router.push('/tracker/rewards')}
          style={styles.rewardsSummary}
        >
          <View style={styles.rewardsIconBg}>
            <Ionicons name="trophy" size={24} color={P.amber} />
          </View>
          <View style={styles.rewardsLines}>
            <Text style={styles.rewardsMain}>3 New Badges Earned</Text>
            <Text style={styles.rewardsSub}>Tap to see your achievements</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={P.amber} />
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
  streakCardWrapper: {
    marginBottom: 30,
  },
  streakCard: {
    borderRadius: 36,
    padding: 24,
    alignItems: 'center',
    shadowColor: P.amber,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  streakIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakCount: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 32,
    color: '#FFF',
  },
  streakLabel: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
    marginBottom: 15,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakBadgeText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 12,
    color: '#FFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 18,
    color: P.text,
  },
  viewRewards: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: P.amber,
  },
  habitCard: {
    backgroundColor: P.card,
    padding: 18,
    borderRadius: 28,
    marginBottom: 14,
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
  habitIconBg: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: P.text,
  },
  habitValue: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: P.textMid,
    marginTop: 1,
  },
  rewardsSummary: {
    marginTop: 10,
    backgroundColor: P.card,
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: P.amberLight,
    borderStyle: 'dashed',
  },
  rewardsIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: P.amberLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rewardsLines: {
    flex: 1,
  },
  rewardsMain: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 15,
    color: P.text,
  },
  rewardsSub: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: P.textMid,
    marginTop: 1,
  },
});
