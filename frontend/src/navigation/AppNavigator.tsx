import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import OpenLogo from '../components/logo/OpenLogo';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const renderLogo = () => <OpenLogo width={76} height={27} />;

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:        { backgroundColor: colors.bgPrimary },
        headerTintColor:    colors.textPrimary,
        headerTitleStyle:   { fontSize: 16, fontWeight: '500', color: colors.textPrimary },
        headerShadowVisible: false,
        contentStyle:       { backgroundColor: colors.bgPrimary },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: renderLogo,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Your Split' }}
      />
    </Stack.Navigator>
  );
}