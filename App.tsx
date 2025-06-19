import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectDeviceScreen from './src/screens/ConnectDeviceScreen';
import DeviceScreen from './src/screens/DeviceScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

export default App;
