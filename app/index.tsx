import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
  ListRenderItemInfo,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDdlStore } from '../src/store/ddlStore';
import { Ddl } from '../src/types';
import { DdlCard } from '../src/components/DdlCard';
import { EmptyState } from '../src/components/EmptyState';
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../src/constants/theme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : COLORS;

  const ddls = useDdlStore((s) => s.ddls);
  const checkExpired = useDdlStore((s) => s.checkExpired);
  const toggleComplete = useDdlStore((s) => s.toggleComplete);

  const [, setTick] = useState(0);
  const hasHydrated = useDdlStore.persist.hasHydrated();

  useEffect(() => {
    checkExpired();
  }, [checkExpired]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedDdls = useMemo(() => {
    return [...ddls].sort((a, b) => a.deadline - b.deadline);
  }, [ddls]);

  const handleToggleComplete = useCallback(
    (id: string) => {
      toggleComplete(id);
    },
    [toggleComplete]
  );

  const renderItem = useCallback(
    (info: ListRenderItemInfo<Ddl>) => (
      <DdlCard ddl={info.item} onToggleComplete={handleToggleComplete} />
    ),
    [handleToggleComplete]
  );

  const keyExtractor = useCallback((item: Ddl) => item.id, []);

  if (!hasHydrated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.md }}>
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        testID="ddl-list"
        data={sortedDdls}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={
          sortedDdls.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={<EmptyState />}
        windowSize={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />

      <TouchableOpacity
        testID="add-button"
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => router.push('/add')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  listContent: {
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.xxl * 3,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
});
