import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { COLORS, DARK_COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export const EmptyState = React.memo(() => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : COLORS;

  return (
    <View style={styles.container}>
      <Text style={[styles.emoji, { color: colors.textMuted }]}>📋</Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        还没有 DDL
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        点击右下角 + 添加吧
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.xxl * 3,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.base,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
  },
});
