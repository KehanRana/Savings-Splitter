import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Savings Splitter</Text>
      <Text>Home</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Results', { balance: 150000 })}
      >
        <Text>See results →</Text>
      </TouchableOpacity>
    </View>
  );
}
