import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../theme';
import OpenLogo from './logo/OpenLogo';

/**
 * Mobile footer — brand wordmark above a legal/copyright line.
 */
export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <OpenLogo width={76} height={27} />
        <Text style={styles.legal}>
          LEGAL TEXT COPYRIGHT AND MORE HERE ©2026
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    paddingHorizontal: spacing.lg, // 16
    paddingVertical:   spacing.xs, //  4
    width:             '100%',
  },
  inner: {
    flex:       1,
    alignItems: 'center',
    gap:        spacing.lg, // 16
  },
  legal: {
    fontFamily:    'Courier',
    fontSize:      10,
    lineHeight:    12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    textAlign:     'center',
    color:         '#8F9197',
  },
});
