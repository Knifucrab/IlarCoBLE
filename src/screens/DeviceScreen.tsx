import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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

  const filteredData = [
    { key: 'id', value: deviceInfo?.id || device?.id || '' },
    { key: 'services', value: deviceInfo?.services || [] },
  ];

  const renderItem = ({ item }: { item: { key: string; value: any } }) => {
    if (item.key === 'services') {
      return (
        <View style={styles.row}>
          <Text style={styles.key}>services:</Text>
          <FlatList
            data={item.value}
            renderItem={({ item: service }) => (
              <Text style={styles.value}>{service.uuid}</Text>
            )}
            keyExtractor={(service) => service.uuid}
          />
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <Text style={styles.key}>{item.key}:</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{device.name || 'Device Data'}</Text>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={styles.flatList}
      />
      {hasCustomService && (
        <View style={styles.sendContainer}>
          <Text style={styles.subHeader}>Send Message</Text>
          <View style={styles.rowCenter}>
            <TextInput
              style={styles.input}
              placeholder="Type message"
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    padding: 16,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', marginBottom: 8 },
  key: { color: '#fff', fontWeight: 'bold', width: 120 },
  value: { color: '#fff', flex: 1, flexWrap: 'wrap' },
  sendContainer: { marginTop: 24, borderColor: 'red' },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#23262F',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    flex: 8,
  },
  flatList: {
    flexGrow: 0,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#34a4eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginLeft: 12,
    flex: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeviceScreen;
