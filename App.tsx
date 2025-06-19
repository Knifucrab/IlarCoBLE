import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConnectDeviceScreen from './src/screens/ConnectDeviceScreen';
import DeviceScreen from './src/screens/DeviceScreen';
import HeatMapScreen from './src/screens/HeatMapScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BleStack() {
  return (
    <Stack.Navigator
      initialRouteName="ConnectDeviceScreen"
      screenOptions={{
        headerStyle: { backgroundColor: '#23262F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ConnectDeviceScreen"
        component={ConnectDeviceScreen}
        options={{ title: 'IlarCo BLE Demo' }}
      />
      <Stack.Screen
        name="DeviceScreen"
        component={DeviceScreen}
        options={{ title: 'Device Data' }}
      />
    </Stack.Navigator>
  );
}

const getTabBarIcon = (routeName: string, color: string, size: number) => {
  if (routeName === 'BLE') {
    return <Icon name="bluetooth-b" size={size} color={color} />;
  } else if (routeName === 'Heat Map') {
    return <Icon name="area-chart" size={size} color={color} />;
  }
  return null;
};

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#23262F' },
          tabBarActiveTintColor: '#34a4eb',
          tabBarInactiveTintColor: '#fff',
          tabBarIcon: ({ color, size }) =>
            getTabBarIcon(route.name, color, size),
        })}
      >
        <Tab.Screen name="BLE" component={BleStack} />
        <Tab.Screen name="Heat Map" component={HeatMapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
