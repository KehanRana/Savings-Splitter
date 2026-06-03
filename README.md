# Savings Splitter

A React Native app that shows how to split a savings balance across multiple
high‑interest Australian savings accounts to **maximise total interest earned**.

Most bonus‑interest savings accounts only pay their headline rate up to a
balance cap. Past that cap, extra money earns the (much lower) base rate. When
you have more cash than a single account's cap, the optimal move is to spread it
across several accounts. Savings Splitter computes that split for you and shows
exactly how much extra you'd earn per year.

---

## Features

- **Optimal allocation** — a greedy algorithm fills accounts in descending
  bonus‑rate order, respecting each account's bonus cap, and reports any balance
  that exceeds every cap.
- **Gain vs. a single account** — compares the optimised split against putting
  everything in the single best account, and surfaces the annual difference.
- **Projection** — extrapolates the annual gain over a 10‑year horizon.
- **Deposit‑protection guidance** — flags balances over the $250,000 Financial
  Claims Scheme (FCS) guarantee per institution.
- **Over‑cap warnings** — flags any balance that exceeds every selected
  account's bonus cap and so can't be placed at a bonus rate, reporting it as
  unallocated.

## Tech stack

- **React Native 0.85** (bare workflow, not Expo) · **React 19** · **TypeScript**
- **react-native-svg** for vector icons / the brand wordmark
- **@react-navigation/native-stack** for navigation
- A small, token‑based design system in [`frontend/src/theme.ts`](frontend/src/theme.ts)
  (colours, spacing, typography, radius, shadows)

## Repository layout

```
.
├── frontend/              # React Native application
   └── src/
       ├── core/          # Domain logic — no UI dependencies
       │   ├── types.ts       # Account / Allocation / SplitResult models
       │   ├── accounts.ts    # Seeded account data + institution branding
       │   └── calculator.ts  # optimiseSplit(), projections, formatters
       ├── hooks/         # useAccounts (selection state), useSplit (memoised calc)
       ├── components/    # Presentational components (co-located styles)
       ├── screens/       # HomeScreen (input) · ResultsScreen (output)
       ├── navigation/    # Stack navigator + route param types
       ├── tests/         # Vitest unit tests for the core logic
       └── theme.ts       # Design tokens
```

The `core/` layer is intentionally free of React/UI imports so the allocation
logic can be unit‑tested in isolation and reused.

## How the allocation works

`optimiseSplit(balance, accounts)` ([`calculator.ts`](frontend/src/core/calculator.ts)):

1. Sort accounts by bonus rate (highest first); ties broken by smaller cap first,
   so a tightly‑capped account is filled before a large‑cap one at the same rate.
2. Walk the sorted list, allocating up to each account's `bonusCap` until the
   balance is exhausted.
3. Any remainder that doesn't fit under any cap is returned as `unallocated`.

Because each account's return is independent, filling the highest‑rate account
first is globally optimal.

## Getting started

### Prerequisites

- Node.js (LTS) and a package manager (`npm`)
- The [React Native environment for bare projects](https://reactnative.dev/docs/set-up-your-environment):
  - **Android:** Android Studio + an emulator (or a connected device)
  - **iOS (macOS only):** Xcode + CocoaPods

### Install

```bash
cd frontend
npm install
# iOS only:
cd ios && pod install && cd ..
```

### Run

Start the Metro bundler in one terminal:

```bash
npm start
```

Then launch the app (with an emulator running or a device connected):

```bash
npm run android   # Android
npm run ios       # iOS (macOS only)
```

## Development

```bash
npx tsc --noEmit               # type-check
npm run lint                   # ESLint
```
