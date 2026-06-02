import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export type RateStatus = 'seed' | 'loading' | 'live' | 'error';

interface Props {
  status: RateStatus;
  fetchedAt: string | null;
  onRefresh: () => void;
}

export default function LiveRateBanner({ status, fetchedAt, onRefresh }: Props) {
  const getText = () => {
    if (status === 'loading') return 'Fetching live rates…';
    if (status === 'live' && fetchedAt) {
      return `Live · Updated ${new Date(fetchedAt).toLocaleTimeString('en-AU')}`;
    }
    if (status === 'error') return 'Could not fetch live rates · Showing May 2026 data';
    return 'Rates as of May 2026 · Tap to refresh';
  };

  return (
    <TouchableOpacity onPress={onRefresh} disabled={status === 'loading'}>
      {status === 'loading' ? <ActivityIndicator size="small" /> : null}
      <Text>{getText()}</Text>
      {status !== 'loading' ? <Text>⟳</Text> : null}
    </TouchableOpacity>
  );
}