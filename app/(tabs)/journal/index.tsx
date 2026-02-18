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
  FlatList,
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
  bg: '#FBF7FF',          // soft lavender-white bg
  card: '#FFFFFF',
  pink: '#F472B6',
  pinkLight: '#FDF2F8',
  pinkMid: '#FBCFE8',
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
  green: '#4CAF88',
  red: '#F87171',
  lavenderMid: '#E0D7FF',
};

// ─── Ripple Background ────────────────────────────────────────────────────────
function RippleBackground() {
  const ripples = [
    useRef(new Animated.Value(0)).current,
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

  const colors = ['#E879F9', '#A78BFA', '#F472B6', '#818CF8'];
  const fills = ['#E879F922', '#A78BFA18', '#F472B61A', '#818CF815'];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {ripples.map((anim, i) => {
        const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.6] });
        const opacity = anim.interpolate({ inputRange: [0, 0.35, 0.7, 1], outputRange: [0.15, 0.08, 0.03, 0] });
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
              backgroundColor: fills[i],
              top: height * 0.25,
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

const JOURNAL_ENTRIES = [
  { id: '1', date: 'Feb 16', title: 'Productive Monday', rating: 4, mood: 'Positive', preview: 'Today I managed to finish all my tasks ahead of schedule...', emoji: '✨' },
  { id: '2', date: 'Feb 15', title: 'Late Night Thoughts', rating: 3, mood: 'Neutral', preview: 'Feeling a bit tired today, but generally okay. Need to sleep early...', emoji: '🌙' },
  { id: '3', date: 'Feb 14', title: 'Valentine Bliss', rating: 5, mood: 'Positive', preview: 'The dinner was spectacular and the company was even better...', emoji: '💖' },
  { id: '4', date: 'Feb 13', title: 'Dealing with Stress', rating: 2, mood: 'Difficult', preview: 'A lot of pressure at work today, struggling to keep calm...', emoji: '🌊' },
];

export default function JournalScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const FilterButton = ({ label }: { label: string }) => {
    const isActive = filter === label;
    return (
      <TouchableOpacity
        onPress={() => setFilter(label)}
        style={[
          styles.filterBtn,
          isActive ? { backgroundColor: P.purple, borderColor: P.purpleMid } : { backgroundColor: P.card, borderColor: P.purpleLight }
        ]}
      >
        <Text style={[
          styles.filterText,
          isActive ? { color: '#FFF' } : { color: P.textMid }
        ]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const EntryCard = ({ item }: { item: typeof JOURNAL_ENTRIES[0] }) => {
    const moodColor = item.mood === 'Positive' ? P.teal : item.mood === 'Neutral' ? P.purple : P.pink;
    const moodBg = item.mood === 'Positive' ? P.tealLight : item.mood === 'Neutral' ? P.purpleLight : P.pinkLight;

    return (
      <TouchableOpacity
        onPress={() => router.push('/journal/entry-detail')}
        style={styles.entryCard}
      >
        <View style={[styles.entryEmojiBg, { backgroundColor: moodBg }]}>
          <Text style={styles.entryEmoji}>{item.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>{item.date}</Text>
            <View style={styles.entryRating}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={12} color={i < item.rating ? P.amber : P.purpleLight} style={{ marginRight: 1 }} />
              ))}
            </View>
          </View>
          <Text style={styles.entryTitle}>{item.title}</Text>
          <Text style={styles.entryPreview} numberOfLines={2}>{item.preview}</Text>
          <View style={[styles.moodBadge, { backgroundColor: moodBg }]}>
            <Text style={[styles.moodBadgeText, { color: moodColor }]}>{item.mood}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />
      <RippleBackground />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Journal</Text>
          <Text style={styles.headerSubtitle}>Capture your journey 📔</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/home/add-journal')}
          style={styles.addBtn}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <FilterButton label="All" />
          <FilterButton label="Positive" />
          <FilterButton label="Difficult Days" />
          <FilterButton label="Reflections" />
        </ScrollView>
      </View>

      <FlatList
        data={JOURNAL_ENTRIES.filter(e => filter === 'All' || (filter === 'Positive' && e.mood === 'Positive') || (filter === 'Difficult Days' && e.mood === 'Difficult'))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EntryCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 28,
    color: P.text,
  },
  headerSubtitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: P.textMid,
    marginTop: -4,
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: P.purple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: P.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  filterContainer: {
    paddingVertical: 15,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1.5,
    shadowColor: P.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 13,
  },
  entryCard: {
    backgroundColor: P.card,
    borderRadius: 30,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: P.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: P.purpleMid + '33',
  },
  entryEmojiBg: {
    width: 60,
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  entryEmoji: {
    fontSize: 28,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryDate: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    color: P.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  entryRating: {
    flexDirection: 'row',
  },
  entryTitle: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 17,
    color: P.text,
    marginBottom: 6,
  },
  entryPreview: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: P.textMid,
    lineHeight: 18,
    marginBottom: 10,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodBadgeText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});