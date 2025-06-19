import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { encodeToBytes } from '../helpers/bleUtils';

const SERVICE_UUID = '01010101-0000-1000-8000-00805f9b34fb'; // 128-bit format

const DeviceScreen = ({ route }: any) => {
  const { device, deviceInfo } = route.params;
  const [message, setMessage] = useState('');

  // Check for the service
  const hasCustomService = deviceInfo?.services?.some(
    (s: any) => s.uuid?.toLowerCase() === SERVICE_UUID.toLowerCase()
  );

  // Find a writable characteristic in the service
  const getWritableCharacteristic = () => {
    if (!deviceInfo?.characteristics) {
      return null;
    }
    return deviceInfo.characteristics.find(
      (c: any) =>
        c.service?.toLowerCase() === SERVICE_UUID.toLowerCase() &&
        (c.properties.Write || c.properties.WriteWithoutResponse)
    );
  };

  const handleSend = async () => {
    const char = getWritableCharacteristic();
    if (!char) {
      Alert.alert('No writable characteristic found');
      return;
    }
    try {
      // Convert string to bytes (UTF-8)
      const data = encodeToBytes(message);
      await BleManager.write(
        device.id,
        SERVICE_UUID,
        char.characteristic,
        data
      );
      Alert.alert('Message sent!');
    } catch (e) {
      Alert.alert('Send failed', String(e));
    }
  };

  // Flatten deviceInfo for display
  const data = Object.entries(deviceInfo || {}).map(([key, value]) => ({
    key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{device.name || 'Device Data'}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.key}>{item.key}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      {hasCustomService && (
        <View style={styles.sendContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type message"
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send Message" onPress={handleSend} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181A20', padding: 16 },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', marginBottom: 8 },
  key: { color: '#fff', fontWeight: 'bold', width: 120 },
  value: { color: '#fff', flex: 1, flexWrap: 'wrap' },
  sendContainer: { marginTop: 24 },
  input: {
    backgroundColor: '#23262F',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});

export default DeviceScreen;
