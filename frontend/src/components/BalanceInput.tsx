import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing, typography, radius } from '../theme';
import { formatShort } from '../core/calculator';

interface Props {
  value:    number;
  onChange: (value: number) => void;
}

const PRESETS = [50_000, 100_000, 150_000, 250_000, 500_000];

export default function BalanceInput({ value, onChange }: Props) {
  const [rawText, setRawText]   = useState(String(value));
  const [isFocused, setFocused] = useState(false);

  function handleTextChange(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setRawText(digits);
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed)) onChange(parsed);
  }

  function handleBlur() {
    setFocused(false);
    if (!rawText || isNaN(parseInt(rawText, 10))) {
      setRawText('0');
      onChange(0);
    }
  }

  function handleFocus() {
    setFocused(true);
    setRawText(value === 0 ? '' : String(value));
  }

  function handleSlider(v: number) {
    const snapped = Math.round(v / 5000) * 5000;
    onChange(snapped);
    setRawText(String(snapped));
  }

  function handlePreset(amount: number) {
    onChange(amount);
    setRawText(String(amount));
  }

  const displayValue = isFocused
    ? rawText
    : value.toLocaleString('en-AU');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total savings balance</Text>

      {/* Currency input */}
      <View style={styles.inputRow}>
        <Text style={styles.prefix}>$</Text>
        <TextInput
          style={styles.input}
          value={displayValue}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="number-pad"
          returnKeyType="done"
          selectTextOnFocus
          maxLength={10}
          placeholder="0"
          placeholderTextColor={colors.borderStrong}
        />
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={600_000}
        step={5_000}
        value={Math.min(value, 600_000)}
        onValueChange={handleSlider}
        minimumTrackTintColor={colors.borderStrong}
        maximumTrackTintColor={colors.borderStrong}
        thumbTintColor={colors.white}
      />

      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>$0</Text>
        <Text style={styles.sliderLabel}>$300k</Text>
        <Text style={styles.sliderLabel}>$600k</Text>
      </View>

      {/* Preset chips */}
      <View style={styles.presets}>
        {PRESETS.map(amount => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.chip,
              value === amount && styles.chipActive,
            ]}
            onPress={() => handlePreset(amount)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.chipText,
              value === amount && styles.chipTextActive,
            ]}>
              {formatShort(amount)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSubtle,
    borderRadius:    radius.lg,
    borderWidth:     0.5,
    borderColor:     colors.borderDefault,
    padding:         spacing.xl,
    marginBottom:    spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.md,
  },

  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    marginBottom:  spacing.lg,
  },
  prefix: {
    fontSize:     36,
    fontWeight:   '300',
    color:        colors.textSecondary,
    marginBottom: Platform.OS === 'android' ? 4 : 2,
    marginRight:  2,
  },
  input: {
    fontSize:           52,
    fontWeight:         '300',
    color:              colors.textPrimary,
    flex:               1,
    padding:            0,
    includeFontPadding: false,
  },

  // Slider
  slider: {
    width:            '100%',
    height:           36,
    marginHorizontal: -spacing.sm,
  },
  sliderLabels: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   spacing.lg,
  },
  sliderLabel: {
    ...typography.caption,
  },

  // Preset chips
  presets: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.sm,
  },
  chip: {
    paddingVertical:   spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius:      radius.pill,
    borderWidth:       0.5,
    borderColor:       colors.borderDefault,
    backgroundColor:   colors.bgPrimary,
  },
  chipActive: {
    backgroundColor: colors.brand400,
    borderColor:     colors.brand400,
  },
  chipText: {
    ...typography.bodyXs,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color:      colors.black,
    fontWeight: '600',
  },
});