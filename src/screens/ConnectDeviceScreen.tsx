import {
  NativeModules,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  NativeEventEmitter,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import BleManager from 'react-native-ble-manager';
import { useNavigation } from '@react-navigation/native';

type BleDevice = {
  id: string;
  name: string;
  serviceData: { [key: string]: any };
  serviceUUIDs: string[];
  isConnectable: boolean;
  [key: string]: any;
};

type RootStackParamList = {
  ConnectDeviceScreen: undefined;
  DeviceScreen: { device: BleDevice; deviceInfo: any };
};

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const ConnectDeviceScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [bledevices, setBleDevices] = useState<BleDevice[]>([]);

  const BleManagerEmitter = useMemo(
    () => new NativeEventEmitter(NativeModules.BleManager),
    []
  );
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'ConnectDeviceScreen'>
    >();

  // SINGLE useEffect for BLE startup logic
  useEffect(() => {
    let isMounted = true;

    const initBle = async () => {
      await BleManager.start({ showAlert: false });
      console.log('Module initialized');
      try {
        await BleManager.enableBluetooth();
        console.log(
          'The bluetooth is already enabled or the user has just enabled it'
        );
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        if (isMounted && granted) {
          await BleManager.scan([], 10, true);
          console.log('Scanning started');
          setIsScanning(true);
        }
      } catch (error) {
        console.error('The user refused to enable bluetooth', error);
      }
    };

    initBle();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle scan stop and discovered devices
  useEffect(() => {
    const handleGetConnectedDevices = () => {
      BleManager.getDiscoveredPeripherals().then((result: Array<any>) => {
        const devicesWithName = result.filter(
          (device: BleDevice) => device.name && device.name.length > 0
        );
        devicesWithName.forEach((device: BleDevice) => {
          console.log('Found device:', device);
        });
        setBleDevices(devicesWithName);
      });
    };

    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        handleGetConnectedDevices();
        console.log('Scan is stopped');
      }
    );
    return () => {
      stopListener.remove();
    };
  }, [BleManagerEmitter]);

  const handleConnect = async (item: BleDevice) => {
    try {
      await BleManager.connect(item.id);
      // Wait a moment for connection to stabilize
      await new Promise<void>((res) => setTimeout(res, 500));
      const deviceInfo = await BleManager.retrieveServices(item.id);
      navigation.navigate('DeviceScreen', { device: item, deviceInfo });
    } catch (error) {
      console.warn('Connection failed:', error);
    }
  };

  return (
    <View style={styles.mainViewStyle}>
      {isScanning ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.titleText}>Scanning for devices...</Text>
        </View>
      ) : (
        <FlatList
          data={bledevices}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnect(item)}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainViewStyle: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181A20',
  },

  titleText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#23262F',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  connectButton: {
    backgroundColor: '#3A3F47',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 12,
  },

  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConnectDeviceScreen;
