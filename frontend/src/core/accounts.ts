import { Account } from './types';

/**
 * The Australian Government's Financial Claims Scheme (FCS) guarantees deposits
 * up to this amount per account-holder, per licensed institution. Balances above
 * it benefit from being split across separate institutions.
 */
export const FCS_GUARANTEE_LIMIT = 250_000;

// ─── Seed Accounts ─────────────────────────────────────────────────────────────
// Rates verified from official bank announcements and savings.com.au
// as of May/June 2026, following the RBA cash rate increase to 4.35%.
//
// These are the ONGOING rates — not intro/welcome rates which expire after 4 months.
//
// Sources:
//   ING:       https://newsroom.ing.com.au/ing-gives-savers-another-lift/
//   UBank:     https://www.savings.com.au/news/rba-savings-accounts-may-2026
//   Macquarie: https://www.savings.com.au/news/rba-savings-accounts-may-2026
//   Up Bank:   https://www.savings.com.au/news/rba-savings-accounts-may-2026
//   Bankwest:  https://www.bankwest.com.au/rates/rates-announcement
//   AMP:       https://www.savings.com.au/news/rba-savings-accounts-may-2026

export const SEED_ACCOUNTS: Account[] = [
  {
    id: 'ing-maximiser',
    name: 'Savings Maximiser',
    institution: 'ING',
    type: 'bonus',
    bonusRate: 5.50,
    baseRate: 0.01,
    bonusCap: 100_000,
    conditions: [
      'Deposit $1,000+/month from an external source',
      'Make 5+ settled card purchases',
      'Grow your nominated balance vs end of prior month',
      'Hold a linked Orange Everyday account',
    ],
    fcsProtected: true,
    dataSource: 'https://newsroom.ing.com.au/ing-gives-savers-another-lift/',
    lastUpdated: '2026-05-15',
  },
  {
    id: 'up-saver',
    name: 'Up Saver',
    institution: 'Up Bank',
    type: 'bonus',
    bonusRate: 5.35,
    baseRate: 2.00,
    bonusCap: 250_000,
    conditions: [
      'Make 5+ purchases/month with Up debit card',
      'Grow your balance each month',
    ],
    fcsProtected: true,
    dataSource: 'https://www.savings.com.au/news/rba-savings-accounts-may-2026',
    lastUpdated: '2026-05-22',
  },
  {
    id: 'amp-go-save',
    name: 'GO Save',
    institution: 'AMP Bank',
    type: 'unconditional',
    bonusRate: 5.10,
    baseRate: 5.10,
    bonusCap: 500_000,
    conditions: [],
    fcsProtected: true,
    dataSource: 'https://www.savings.com.au/news/rba-savings-accounts-may-2026',
    lastUpdated: '2026-05-11',
  },
  {
    id: 'ubank-save',
    name: 'High Interest Savings',
    institution: 'UBank',
    type: 'bonus',
    bonusRate: 5.10,
    baseRate: 0.00,
    bonusCap: 1_000_000,
    conditions: [
      'Deposit $200+/month',
    ],
    fcsProtected: true,
    dataSource: 'https://www.savings.com.au/news/rba-savings-accounts-may-2026',
    lastUpdated: '2026-05-12',
  },
  {
    id: 'macquarie-savings',
    name: 'Savings Account',
    institution: 'Macquarie',
    type: 'unconditional',
    bonusRate: 5.00,
    baseRate: 5.00,
    bonusCap: 2_000_000,
    conditions: [],
    fcsProtected: true,
    dataSource: 'https://www.savings.com.au/news/rba-savings-accounts-may-2026',
    lastUpdated: '2026-05-20',
  },
  {
    id: 'bankwest-easy',
    name: 'Easy Saver',
    institution: 'Bankwest',
    type: 'unconditional',
    bonusRate: 5.00,
    baseRate: 5.00,
    bonusCap: 250_000,
    conditions: [],
    fcsProtected: true,
    dataSource: 'https://www.bankwest.com.au/rates/rates-announcement',
    lastUpdated: '2026-05-15',
  },
];

// ─── Visual identity ───────────────────────────────────────────────────────────
// Used by AccountCard and AllocationBar to colour-code each institution.
// Keyed by `institution` field on Account.

export const INSTITUTION_COLORS: Record<string, string> = {
  'Up Bank':  '#7B2CF8',
  ING:        '#FF6200',
  'AMP Bank': '#003087',
  UBank:      '#0066CC',
  Macquarie:  '#0D4B8E',
  Bankwest:   '#DF0024',
};

// ─── Allocation bar palette ────────────────────────────────────────────────────
// Ordered list used when rendering the multi-segment allocation bar.
// Matches SEED_ACCOUNTS order so colours stay consistent across rerenders.

export const ALLOCATION_PALETTE = [
  '#FF6200',  // ING
  '#7B2CF8',  // Up Bank
  '#003087',  // AMP Bank
  '#0066CC',  // UBank
  '#0D4B8E',  // Macquarie
  '#DF0024',  // Bankwest
];

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Returns the brand colour for a given institution name.
 * Falls back to a neutral grey if the institution isn't in the map.
 */
export function getInstitutionColor(institution: string): string {
  return INSTITUTION_COLORS[institution] ?? '#6B6860';
}