import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

async function requestPermissions() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    // Optionally, check if permissions are granted
    if (
      granted['android.permission.BLUETOOTH_SCAN'] !==
        PermissionsAndroid.RESULTS.GRANTED ||
      granted['android.permission.BLUETOOTH_CONNECT'] !==
        PermissionsAndroid.RESULTS.GRANTED ||
      granted['android.permission.ACCESS_FINE_LOCATION'] !==
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.warn('Required permissions not granted');
    }
  }
}

function App(): JSX.Element {
  useEffect(() => {
    requestPermissions().then(() => {
      BleManager.start({showAlert: false}).then(() => {
        console.log('BleManager initialized');
        BleManager.scan([], 5, true).then(() => {
          console.log('Scan started');
        });
      });
    });

    const subscription = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral: any) => {
        console.log('Discovered peripheral:', peripheral);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView>
      <Text>Scanning for BLE devices... Check your console for results.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
