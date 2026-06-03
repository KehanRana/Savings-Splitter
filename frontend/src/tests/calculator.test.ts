import { describe, it, expect } from 'vitest';
import { optimiseSplit, buildProjection, formatCurrency, formatRate, formatShort } from '../core/calculator';
import { Account } from '../core/types';

// ─── Test fixtures ─────────────────────────────────────────────────────────────

const ING: Account = {
  id: 'ing', name: 'Savings Maximiser', institution: 'ING',
  type: 'bonus', bonusRate: 5.25, baseRate: 0.01, bonusCap: 100_000,
  conditions: [], fcsProtected: true, dataSource: '', lastUpdated: '2026-05-15',
};

const UBANK: Account = {
  id: 'ubank', name: 'High Interest Savings', institution: 'UBank',
  type: 'bonus', bonusRate: 5.10, baseRate: 0.00, bonusCap: 1_000_000,
  conditions: [], fcsProtected: true, dataSource: '', lastUpdated: '2026-05-12',
};

const MACQUARIE: Account = {
  id: 'mac', name: 'Savings Account', institution: 'Macquarie',
  type: 'unconditional', bonusRate: 5.00, baseRate: 5.00, bonusCap: 2_000_000,
  conditions: [], fcsProtected: true, dataSource: '', lastUpdated: '2026-05-20',
};

const UP: Account = {
  id: 'up', name: 'Up Saver', institution: 'Up Bank',
  type: 'bonus', bonusRate: 5.35, baseRate: 2.00, bonusCap: 250_000,
  conditions: [], fcsProtected: true, dataSource: '', lastUpdated: '2026-05-22',
};

// ─── optimiseSplit ─────────────────────────────────────────────────────────────

describe('optimiseSplit — guard cases', () => {
  it('returns zero result when balance is 0', () => {
    const r = optimiseSplit(0, [ING]);
    expect(r.totalOptimisedReturn).toBe(0);
    expect(r.allocations).toHaveLength(0);
    expect(r.unallocated).toBe(0);
  });

  it('returns zero result when account list is empty', () => {
    const r = optimiseSplit(100_000, []);
    expect(r.totalOptimisedReturn).toBe(0);
    expect(r.allocations).toHaveLength(0);
    expect(r.unallocated).toBe(100_000);
  });
});

describe('optimiseSplit — single account', () => {
  it('allocates full balance when balance < cap', () => {
    const r = optimiseSplit(50_000, [ING]);
    expect(r.allocations).toHaveLength(1);
    expect(r.allocations[0].allocated).toBe(50_000);
  });

  it('calculates correct annual return for single account', () => {
    const r = optimiseSplit(50_000, [ING]);
    expect(r.totalOptimisedReturn).toBeCloseTo(50_000 * 0.0525, 2);
  });

  it('annual gain is 0 when only one account (no split benefit)', () => {
    const r = optimiseSplit(50_000, [ING]);
    expect(r.annualGain).toBe(0);
  });

  it('caps allocation at bonusCap and reports remainder as unallocated', () => {
    const r = optimiseSplit(120_000, [ING]);
    expect(r.allocations[0].allocated).toBe(100_000);
    expect(r.unallocated).toBe(20_000);
  });
});

describe('optimiseSplit — multiple accounts', () => {
  it('fills highest-rate account first', () => {
    // ING 5.25% > UBank 5.10% > Macquarie 5.00%
    const r = optimiseSplit(50_000, [MACQUARIE, UBANK, ING]);
    expect(r.allocations[0].account.id).toBe('ing');
  });

  it('fills Up Bank (5.35%) before ING (5.25%)', () => {
    const r = optimiseSplit(50_000, [ING, UP]);
    expect(r.allocations[0].account.id).toBe('up');
  });

  it('splits $150k correctly across ING ($100k) and UBank ($50k)', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const ing = r.allocations.find(a => a.account.id === 'ing')!;
    const ubank = r.allocations.find(a => a.account.id === 'ubank')!;
    expect(ing.allocated).toBe(100_000);
    expect(ubank.allocated).toBe(50_000);
  });

  it('calculates correct optimised return for $150k across ING + UBank', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const expected = 100_000 * 0.0525 + 50_000 * 0.0510;
    expect(r.totalOptimisedReturn).toBeCloseTo(expected, 2);
  });

  it('annual gain is positive when split beats single account', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    expect(r.annualGain).toBeGreaterThan(0);
  });

  it('unallocated is 0 when balance fits within combined caps', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    expect(r.unallocated).toBe(0);
  });

  it('reports unallocated when balance exceeds all caps', () => {
    const smallCap: Account = { ...ING, id: 'small', bonusCap: 40_000 };
    const r = optimiseSplit(100_000, [smallCap]);
    expect(r.unallocated).toBe(60_000);
  });

  it('effective rate is a weighted blend of all allocation rates', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const expected =
      (100_000 * 0.0525 + 50_000 * 0.0510) / 150_000 * 100;
    expect(r.effectiveRate).toBeCloseTo(expected, 4);
  });
});

// ─── buildProjection ───────────────────────────────────────────────────────────

describe('buildProjection', () => {
  it('returns years+1 data points (including year 0)', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const pts = buildProjection(150_000, r, 10);
    expect(pts).toHaveLength(11);
  });

  it('year 0 values equal the starting balance', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const pts = buildProjection(150_000, r, 10);
    expect(pts[0].optimised).toBe(150_000);
    expect(pts[0].current).toBe(150_000);
    expect(pts[0].optimisedInterest).toBe(0);
    expect(pts[0].currentInterest).toBe(0);
  });

  it('labels year 0 as "Now"', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const pts = buildProjection(150_000, r, 10);
    expect(pts[0].label).toBe('Now');
    expect(pts[1].label).toBe('Yr 1');
  });

  it('optimised grows faster than current over time', () => {
    const r = optimiseSplit(150_000, [ING, UBANK]);
    const pts = buildProjection(150_000, r, 10);
    expect(pts[10].optimised).toBeGreaterThan(pts[10].current);
  });
});

// ─── Formatting helpers ────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats whole dollars', () => {
    expect(formatCurrency(5250)).toBe('$5,250');
  });
  it('rounds to nearest dollar', () => {
    expect(formatCurrency(5250.75)).toBe('$5,251');
  });
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('formatRate', () => {
  it('formats to 2 decimal places with suffix', () => {
    expect(formatRate(5.25)).toBe('5.25% p.a.');
    expect(formatRate(5.1)).toBe('5.10% p.a.');
  });
});

describe('formatShort', () => {
  it('formats thousands as k', () => {
    expect(formatShort(150_000)).toBe('$150k');
  });
  it('formats millions as m', () => {
    expect(formatShort(1_200_000)).toBe('$1.2m');
  });
  it('formats small amounts as-is', () => {
    expect(formatShort(500)).toBe('$500');
  });
});