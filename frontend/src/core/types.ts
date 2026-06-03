/**
 * Whether the account's high rate is conditional on monthly behaviour
 * or always-on (unconditional).
 *
 * bonus         — high rate only if monthly conditions met (e.g. ING, UBank)
 * unconditional — high rate always applies, no hoops (e.g. Macquarie, AMP)
 */
export type AccountType = 'bonus' | 'unconditional';

/**
 * A single savings account product.
 * Seeded from accounts.ts.
 */
export interface Account {
  id: string;               // stable identifier, e.g. 'ing-maximiser'
  name: string;             // product name, e.g. 'Savings Maximiser'
  institution: string;      // bank name, e.g. 'ING'
  type: AccountType;

  bonusRate: number;        // highest achievable ongoing rate (% p.a.)
  baseRate: number;         // rate if bonus conditions not met (0 for unconditional)
  bonusCap: number;         // max balance ($AUD) eligible for bonusRate

  conditions: string[];     // human-readable monthly bonus conditions
  fcsProtected: boolean;    // deposits guaranteed under Financial Claims Scheme

  dataSource: string;       // URL or label of the rate source
  lastUpdated: string;      // ISO date string, e.g. '2026-05-15'
}

/**
 * How much of a user's balance is allocated to one account,
 * and what that portion earns.
 */
export interface Allocation {
  account: Account;
  allocated: number;       // total $ placed in this account (always ≤ bonusCap)
  annualReturn: number;    // $ earned per year from this allocation (at bonusRate)
}

/**
 * The full output of optimiseSplit() — everything the UI needs to render.
 */
export interface SplitResult {
  allocations: Allocation[];

  totalOptimisedReturn: number;  // $ earned across all accounts (optimised)
  totalCurrentReturn: number;    // $ earned if all money in single best account
  annualGain: number;            // difference: optimised minus current

  unallocated: number;           // $ that couldn't fit in any account cap
  effectiveRate: number;         // blended rate across all allocations (% p.a.)
}