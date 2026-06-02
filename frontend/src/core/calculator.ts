import { Account, Allocation, SplitResult } from './types';

/**
 * Greedy allocation: fill accounts in descending bonusRate order,
 * up to each account's bonusCap. Any remainder after all caps are
 * exhausted is reported as `unallocated`.
 *
 * Why greedy? Each account's return is independent — filling the
 * highest-rate account first is always globally optimal here.
 */
export function optimiseSplit(
  balance: number,
  accounts: Account[],
): SplitResult {
  // Guard: nothing to do
  if (accounts.length === 0 || balance <= 0) {
    return {
      allocations: [],
      totalOptimisedReturn: 0,
      totalCurrentReturn: 0,
      annualGain: 0,
      unallocated: balance,
      effectiveRate: 0,
    };
  }

  // Sort: highest bonusRate first; break ties by smallest cap first
  // (prefer using a tightly-capped account before a large-cap one
  //  at the same rate — maximises eligibility)
  const sorted = [...accounts].sort((a, b) => {
    if (b.bonusRate !== a.bonusRate) return b.bonusRate - a.bonusRate;
    return a.bonusCap - b.bonusCap;
  });

  let remaining = balance;
  const allocations: Allocation[] = [];

  for (const account of sorted) {
    if (remaining <= 0) break;

    const allocated = Math.min(remaining, account.bonusCap);
    remaining -= allocated;

    // How much earns the bonus rate vs spills over into base rate?
    // (In normal operation allocated === bonusCap so earnsBaseOn === 0.
    //  The only over-cap case is when this is the last account and the
    //  user has more money than all caps combined — handled by unallocated.)
    const earnsBonusOn = Math.min(allocated, account.bonusCap);
    const earnsBaseOn = Math.max(0, allocated - account.bonusCap);

    const annualReturn =
      earnsBonusOn * (account.bonusRate / 100) +
      earnsBaseOn * (account.baseRate / 100);

    allocations.push({
      account,
      allocated,
      earnsBonusOn,
      earnsBaseOn,
      annualReturn,
    });
  }

  const unallocated = Math.max(0, remaining);
  const totalOptimisedReturn = allocations.reduce(
    (sum, a) => sum + a.annualReturn,
    0,
  );

  // "Current" benchmark: all money in the single best account
  const best = sorted[0];
  const inBonus = Math.min(balance, best.bonusCap);
  const inBase = Math.max(0, balance - best.bonusCap);
  const totalCurrentReturn =
    inBonus * (best.bonusRate / 100) +
    inBase * (best.baseRate / 100);

  // Blended effective rate across allocated balance
  const allocatedBalance = balance - unallocated;
  const effectiveRate =
    allocatedBalance > 0
      ? (totalOptimisedReturn / allocatedBalance) * 100
      : 0;

  return {
    allocations,
    totalOptimisedReturn,
    totalCurrentReturn,
    annualGain: totalOptimisedReturn - totalCurrentReturn,
    unallocated,
    effectiveRate,
  };
}

// ─── Projection ────────────────────────────────────────────────────────────────

export interface ProjectionPoint {
  year: number;
  label: string;       // 'Now', 'Yr 1', 'Yr 5' …
  optimised: number;   // total balance after compound growth (optimised split)
  current: number;     // total balance after compound growth (single account)
  optimisedInterest: number;  // cumulative interest earned (optimised)
  currentInterest: number;    // cumulative interest earned (current)
}

/**
 * Build a year-by-year compound growth series.
 * Assumes rates remain constant — clearly noted in the UI disclaimer.
 */
export function buildProjection(
  balance: number,
  result: SplitResult,
  years = 10,
): ProjectionPoint[] {
  const rOpt = result.totalOptimisedReturn / balance;   // annual rate as decimal
  const rCur = result.totalCurrentReturn / balance;

  return Array.from({ length: years + 1 }, (_, yr) => {
    const optimised = balance * Math.pow(1 + rOpt, yr);
    const current   = balance * Math.pow(1 + rCur, yr);
    return {
      year: yr,
      label: yr === 0 ? 'Now' : `Yr ${yr}`,
      optimised: Math.round(optimised),
      current:   Math.round(current),
      optimisedInterest: Math.round(optimised - balance),
      currentInterest:   Math.round(current - balance),
    };
  });
}

// ─── Formatting helpers ────────────────────────────────────────────────────────

/**
 * Format a number as AUD currency with no decimal places.
 * e.g. 5250 → '$5,250'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Format a rate as a percentage string.
 * e.g. 5.25 → '5.25% p.a.'
 */
export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}% p.a.`;
}

/**
 * Format a large number in shorthand.
 * e.g. 150000 → '$150k', 1200000 → '$1.2m'
 */
export function formatShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}m`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}k`;
  }
  return `$${amount}`;
}