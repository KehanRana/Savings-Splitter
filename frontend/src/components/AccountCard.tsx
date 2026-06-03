import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Account } from '../core/types';
import { formatRate, formatCurrency } from '../core/calculator';
import { getInstitutionColor } from '../core/accounts';
import { colors, spacing, typography, radius } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  account:    Account;
  isSelected: boolean;
  onToggle:   () => void;
}

/** Monogram for the avatar — first letter of each word, max two. */
function monogram(institution: string): string {
  const parts = institution.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

/** Status pill — mapped from account type. */
function statusBadge(type: Account['type']) {
  return type === 'unconditional'
    ? { label: 'NO CONDITIONS', bg: colors.statusHealthy }
    : { label: 'BONUS RATE',    bg: colors.statusAlert };
}

export default function AccountCard({ account, isSelected, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const brandColor = getInstitutionColor(account.institution);
  const badge      = statusBadge(account.type);

  function handleExpand() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  }

  return (
    <View style={[
      styles.card,
      isSelected && styles.cardSelected,
      isSelected && { borderColor: brandColor },
    ]}>

      {/* Status pill */}
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={styles.badgeText}>{badge.label}</Text>
      </View>

      {/* Top row */}
      <View style={styles.topRow}>

        {/* Avatar + name (tap to expand) */}
        <TouchableOpacity
          style={styles.leftArea}
          onPress={handleExpand}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: brandColor }]}>
              {monogram(account.institution)}
            </Text>
          </View>

          <View style={styles.nameBlock}>
            <View style={styles.headingRow}>
              <Text style={styles.name} numberOfLines={1}>{account.name}</Text>
              <Svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                style={[styles.chevron, expanded && styles.chevronExpanded]}
              >
                <Path
                  d="M6 9L12 15L18 9"
                  stroke={colors.white}
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.subtitle} numberOfLines={1}>
              {account.institution} · {formatRate(account.bonusRate)} · up to {formatCurrency(account.bonusCap)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Radio selector (tap to include) */}
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[
            styles.radio,
            isSelected && { borderColor: colors.white },
          ]}
        >
          {isSelected && <View style={styles.radioCore} />}
        </TouchableOpacity>
      </View>

      {/* Expanded detail */}
      {expanded && (
        <View style={styles.detail}>
          <View style={styles.divider} />

          {account.type === 'unconditional' ? (
            <View style={styles.noBadge}>
              <Text style={styles.noBadgeText}>✓  No monthly conditions</Text>
            </View>
          ) : (
            <View style={styles.conditions}>
              {account.conditions.map((c, i) => (
                <View key={i} style={styles.condRow}>
                  <View style={styles.condBullet} />
                  <Text style={styles.condText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.metaRow}>
            {account.type === 'bonus' && (
              <Text style={styles.metaText}>
                Base: {formatRate(account.baseRate)}
              </Text>
            )}
            {account.fcsProtected && (
              <View>
                <Text style={styles.fcsText}>FCS protected</Text>
              </View>
            )}
          </View>

          <Text style={styles.sourceText}>Updated {account.lastUpdated}</Text>
        </View>
      )}
    </View>
  );
}

const AVATAR = 52;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSubtle,
    borderRadius:    radius.lg,
    borderWidth:     0.5,
    borderColor:     colors.borderDefault,
    marginTop:       spacing.md,   // headroom for the straddling pill
    marginBottom:    spacing.sm,
  },
  cardSelected: {
    borderWidth: 1,
  },

  // Status pill
  badge: {
    position:          'absolute',
    top:               -11,
    left:              spacing.lg,
    borderRadius:      radius.pill,
    paddingVertical:   3,
    paddingHorizontal: spacing.sm,
    zIndex:            1,
  },
  badgeText: {
    fontSize:      10,
    fontWeight:    '700',
    letterSpacing: 0.8,
    color:         colors.black,
    textTransform: 'uppercase',
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical:   spacing.lg,
    paddingHorizontal: spacing.lg,
    gap:           spacing.md,
  },
  leftArea: {
    flexDirection: 'row',
    alignItems:    'center',
    flex:          1,
    gap:           spacing.md,
  },

  // Avatar
  avatar: {
    width:           AVATAR,
    height:          AVATAR,
    borderRadius:    AVATAR / 2,
    backgroundColor: colors.bgSurface,
    borderWidth:     2,
    borderColor:     colors.black,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  avatarText: {
    fontSize:   20,
    fontWeight: '700',
  },

  // Name block
  nameBlock: { flex: 1 },
  headingRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.xs,
  },
  name: {
    ...typography.bodyLgStrong,
    flexShrink: 1,
  },
  chevron: {
    flexShrink: 0,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  subtitle: {
    ...typography.bodySm,
    color:     colors.textSecondary,
    marginTop: 2,
  },

  // Radio selector
  radio: {
    width:          24,
    height:         24,
    borderRadius:   12,
    borderWidth:    1.5,
    borderColor:    colors.borderStrong,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  radioCore: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: colors.white,
  },

  // Expanded
  detail: {
    paddingHorizontal: spacing.lg,
    paddingBottom:     spacing.lg,
  },
  divider: {
    height:          0.5,
    backgroundColor: colors.borderDefault,
    marginBottom:    spacing.md,
  },
  noBadge: {
    backgroundColor:   colors.gainBg,
    borderRadius:      radius.pill,
    paddingVertical:   spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf:         'flex-start',
    marginBottom:      spacing.md,
    borderWidth:       0.5,
    borderColor:       colors.gain,
  },
  noBadgeText: {
    fontSize:   12,
    fontWeight: '500',
    color:      colors.gain,
  },
  conditions: {
    marginBottom: spacing.md,
    gap:          spacing.xs,
  },
  condRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           spacing.sm,
  },
  condBullet: {
    width:           4,
    height:          4,
    borderRadius:    radius.pill,
    backgroundColor: colors.textSecondary,
    marginTop:       7,
    flexShrink:      0,
  },
  condText: {
    ...typography.bodySm,
    flex:       1,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection:  'row',
    alignItems:     'center',
    flexWrap:       'wrap',
    gap:            spacing.sm,
    marginBottom:   spacing.sm,
  },
  metaText:    { ...typography.caption },
  fcsText: {
    fontSize:   10,
    color:      colors.infoText,
    fontWeight: '500',
  },
  sourceText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});