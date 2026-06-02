import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

export default function ResultsScreen({ navigation, route }: Props) {
  const { balance } = route.params;

  return (
    <View>
      <Text>Results</Text>
      <Text>Balance: ${balance.toLocaleString()}</Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}
