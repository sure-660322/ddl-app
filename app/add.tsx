import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useDdlStore } from '../src/store/ddlStore';
import {
  COLORS,
  DARK_COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../src/constants/theme';

export default function AddScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : COLORS;

  const addDdl = useDdlStore((s) => s.addDdl);

  const defaultDate = new Date(Date.now() + 86400000);
  defaultDate.setHours(23, 59, 0, 0);

  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState(defaultDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const newDate = new Date(deadline);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setDeadline(newDate);
      }
    },
    [deadline]
  );

  const handleTimeChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowTimePicker(false);
      if (selectedDate) {
        const newDate = new Date(deadline);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        setDeadline(newDate);
      }
    },
    [deadline]
  );

  const handleSave = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('提示', '请输入 DDL 名称');
      return;
    }
    if (deadline.getTime() <= Date.now()) {
      Alert.alert('提示', '截止日期必须在未来时间');
      return;
    }
    addDdl(trimmed, deadline.getTime());
    router.back();
  }, [name, deadline, addDdl]);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatTime = (d: Date) => {
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              DDL 名称
            </Text>
            <TextInput
              testID="ddl-name-input"
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="例如：大作业提交"
              placeholderTextColor={colors.textMuted}
              maxLength={50}
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              截止日期
            </Text>
            <TouchableOpacity
              testID="date-picker-button"
              style={[
                styles.pickerButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.pickerText, { color: colors.textPrimary }]}>
                {formatDate(deadline)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="date-picker"
                value={deadline}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              截止时间
            </Text>
            <TouchableOpacity
              testID="time-picker-button"
              style={[
                styles.pickerButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.pickerText, { color: colors.textPrimary }]}>
                {formatTime(deadline)}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                testID="time-picker"
                value={deadline}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                is24Hour
              />
            )}
          </View>

          <TouchableOpacity
            testID="save-button"
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveText}>保存</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  pickerText: {
    fontSize: FONT_SIZE.md,
  },
  saveButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
});
