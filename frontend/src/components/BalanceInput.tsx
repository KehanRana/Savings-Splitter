import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { formatShort } from '../core/calculator';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

// Quick-select preset amounts
const PRESETS = [50_000, 100_000, 150_000, 250_000, 500_000];

export default function BalanceInput({ value, onChange }: Props) {
  // Raw string while the user is typing — lets them clear and retype freely
  const [rawText, setRawText] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleTextChange(text: string) {
    // Strip everything except digits
    const digits = text.replace(/[^0-9]/g, '');
    setRawText(digits);
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed)) onChange(parsed);
  }

  function handleBlur() {
    setIsFocused(false);
    // Snap to 0 if the field was cleared
    if (rawText === '' || isNaN(parseInt(rawText, 10))) {
      setRawText('0');
      onChange(0);
    }
  }

  function handleFocus() {
    setIsFocused(true);
    // Show plain digits while editing — no commas
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

  // ── Display value ─────────────────────────────────────────────────────────────
  // While focused: show raw digits (editable)
  // While blurred: show formatted with commas

  const displayValue = isFocused
    ? rawText
    : value.toLocaleString('en-AU');

  return (
    <View>
      {/* Label */}
      <Text>Total savings balance</Text>

      {/* Currency input row */}
      <View>
        <Text>$</Text>
        <TextInput
          value={displayValue}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="number-pad"
          returnKeyType="done"
          selectTextOnFocus
          maxLength={10}
          placeholder="0"
        />
      </View>

      {/* Slider */}
      <Slider
        minimumValue={0}
        maximumValue={600_000}
        step={5_000}
        value={Math.min(value, 600_000)}
        onValueChange={handleSlider}
      />

      {/* Slider range labels */}
      <View>
        <Text>$0</Text>
        <Text>$300k</Text>
        <Text>$600k</Text>
      </View>

      {/* Quick-select presets */}
      <View>
        {PRESETS.map(amount => (
          <TouchableOpacity
            key={amount}
            onPress={() => handlePreset(amount)}
          >
            <Text>{formatShort(amount)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}