import { describe, it, expect } from 'vitest';
import { SEED_ACCOUNTS, INSTITUTION_COLORS, getInstitutionColor } from '../core/accounts';

// ─── Data integrity ────────────────────────────────────────────────────────────

describe('SEED_ACCOUNTS — data integrity', () => {
  it('has at least 3 accounts', () => {
    expect(SEED_ACCOUNTS.length).toBeGreaterThanOrEqual(3);
  });

  it('every account has a unique id', () => {
    const ids = SEED_ACCOUNTS.map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every account has a positive bonusRate', () => {
    SEED_ACCOUNTS.forEach(a => {
      expect(a.bonusRate).toBeGreaterThan(0);
    });
  });

  it('every account has a positive bonusCap', () => {
    SEED_ACCOUNTS.forEach(a => {
      expect(a.bonusCap).toBeGreaterThan(0);
    });
  });

  it('baseRate is never greater than bonusRate', () => {
    SEED_ACCOUNTS.forEach(a => {
      expect(a.baseRate).toBeLessThanOrEqual(a.bonusRate);
    });
  });

  it('unconditional accounts have empty conditions array', () => {
    SEED_ACCOUNTS
      .filter(a => a.type === 'unconditional')
      .forEach(a => {
        expect(a.conditions).toHaveLength(0);
      });
  });

  it('bonus accounts have at least one condition', () => {
    SEED_ACCOUNTS
      .filter(a => a.type === 'bonus')
      .forEach(a => {
        expect(a.conditions.length).toBeGreaterThan(0);
      });
  });

  it('unconditional accounts have equal bonusRate and baseRate', () => {
    SEED_ACCOUNTS
      .filter(a => a.type === 'unconditional')
      .forEach(a => {
        expect(a.bonusRate).toBe(a.baseRate);
      });
  });

  it('every account has a non-empty dataSource', () => {
    SEED_ACCOUNTS.forEach(a => {
      expect(a.dataSource.length).toBeGreaterThan(0);
    });
  });

  it('every account has a valid lastUpdated date string', () => {
    SEED_ACCOUNTS.forEach(a => {
      expect(a.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('all accounts are marked fcsProtected', () => {
    SEED_ACCOUNTS.forEach(a => {
      expect(a.fcsProtected).toBe(true);
    });
  });
});

// ─── Ordering ─────────────────────────────────────────────────────────────────

describe('SEED_ACCOUNTS — ordering', () => {
  it('is sorted by bonusRate descending', () => {
    for (let i = 0; i < SEED_ACCOUNTS.length - 1; i++) {
      expect(SEED_ACCOUNTS[i].bonusRate).toBeGreaterThanOrEqual(
        SEED_ACCOUNTS[i + 1].bonusRate,
      );
    }
  });
});

// ─── getInstitutionColor ───────────────────────────────────────────────────────

describe('getInstitutionColor', () => {
  it('returns a hex color for known institutions', () => {
    Object.keys(INSTITUTION_COLORS).forEach(institution => {
      const color = getInstitutionColor(institution);
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('returns fallback grey for unknown institution', () => {
    expect(getInstitutionColor('Unknown Bank')).toBe('#6B6860');
  });

  it('returns ING orange for ING', () => {
    expect(getInstitutionColor('ING')).toBe('#FF6200');
  });

  it('returns Up Bank purple for Up Bank', () => {
    expect(getInstitutionColor('Up Bank')).toBe('#7B2CF8');
  });
});