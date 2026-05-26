import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ddl } from '../types';
import { getRemainingTime } from '../utils/time';
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../constants/theme';

interface DdlCardProps {
  ddl: Ddl;
  onToggleComplete: (id: string) => void;
}

export const DdlCard = React.memo(
  ({ ddl, onToggleComplete }: DdlCardProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? DARK_COLORS : COLORS;
    const { text, isExpired } = getRemainingTime(ddl.deadline);

    const isCompleted = ddl.status === 'completed';
    const isExpiredStatus = ddl.status === 'expired' || (ddl.status === 'active' && isExpired);

    const statusLabel = isCompleted ? '已完成' : isExpiredStatus ? '已过期' : null;
    const statusBgColor = isCompleted
      ? colors.successLight
      : isExpiredStatus
        ? colors.dangerLight
        : undefined;
    const statusTextColor = isCompleted
      ? colors.success
      : isExpiredStatus
        ? colors.danger
        : undefined;

    return (
      <TouchableOpacity
        testID={`ddl-card-${ddl.id}`}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onToggleComplete(ddl.id)}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.info}>
            <Text
              style={[
                styles.name,
                { color: colors.textPrimary },
                (isCompleted || isExpiredStatus) && styles.nameDone,
              ]}
              numberOfLines={2}
            >
              {ddl.name}
            </Text>
            <Text
              style={[
                styles.countdown,
                { color: isExpiredStatus ? colors.danger : colors.textSecondary },
              ]}
            >
              {isCompleted ? '已完成' : text}
            </Text>
          </View>

          {statusLabel && (
            <View style={[styles.badge, { backgroundColor: statusBgColor }]}>
              <Text style={[styles.badgeText, { color: statusTextColor }]}>
                {statusLabel}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  },
  (prev, next) =>
    prev.ddl.id === next.ddl.id &&
    prev.ddl.status === next.ddl.status &&
    prev.ddl.name === next.ddl.name
);

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.sm,
    padding: SPACING.base,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  nameDone: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  countdown: {
    fontSize: FONT_SIZE.sm,
  },
  badge: {
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
