import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { encodeToBytes } from '../helpers/bleUtils';

const SERVICE_UUID = '01010101-0000-1000-8000-00805f9b34fb';
const WRITE_CHAR_UUID = '02020202-0000-1000-8000-00805f9b34fb';
const READ_CHAR_UUID = '03030303-0000-1000-8000-00805f9b34fb';

const DeviceScreen = ({ route }: any) => {
  const { device, deviceInfo } = route.params;
  const [message, setMessage] = useState('');
  const [receivedText, setReceivedText] = useState('No text received');

  const BleManagerEmitter = useMemo(
    () => new NativeEventEmitter(NativeModules.BleManager),
    []
  );

  // Find the read/notify characteristic
  const readCharacteristic = deviceInfo?.characteristics?.find(
    (c: any) =>
      c.service?.toLowerCase() === SERVICE_UUID.toLowerCase() &&
      c.characteristic?.toLowerCase() === READ_CHAR_UUID.toLowerCase() &&
      c.properties.Notify
  );

  // Find the write characteristic
  const writeCharacteristic = deviceInfo?.characteristics?.find(
    (c: any) =>
      c.service?.toLowerCase() === SERVICE_UUID.toLowerCase() &&
      c.characteristic?.toLowerCase() === WRITE_CHAR_UUID.toLowerCase() &&
      (c.properties.Write || c.properties.WriteWithoutResponse)
  );

  // Enable notifications for the read characteristic
  useEffect(() => {
    if (readCharacteristic) {
      BleManager.startNotification(device.id, SERVICE_UUID, READ_CHAR_UUID)
        .then(() => {
          console.log('Notification started');
        })
        .catch((err) => {
          console.warn('Notification error', err);
        });
    }
  }, [device, readCharacteristic]);

  // Listen for notifications
  useEffect(() => {
    const subscription = BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value, service, characteristic }) => {
        if (
          service?.toLowerCase() === SERVICE_UUID.toLowerCase() &&
          characteristic?.toLowerCase() === READ_CHAR_UUID.toLowerCase()
        ) {
          const text = String.fromCharCode(...value);
          setReceivedText(text);
        }
      }
    );
    return () => subscription.remove();
  }, [BleManagerEmitter]);

  const handleSend = async () => {
    if (!writeCharacteristic) {
      Alert.alert('No writable characteristic found');
      return;
    }
    try {
      const data = encodeToBytes(message);
      await BleManager.write(device.id, SERVICE_UUID, WRITE_CHAR_UUID, data);
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

      {/* Only show if read characteristic exists */}
      {readCharacteristic && (
        <View style={styles.receivedContainer}>
          <Text style={styles.subHeader}>String received</Text>
          <Text style={styles.receivedText}>{receivedText}</Text>
        </View>
      )}

      {/* Only show if write characteristic exists */}
      {writeCharacteristic && (
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
  sendContainer: { marginTop: 24 },
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
  receivedText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  receivedContainer: {
    marginTop: 24,
  },
});

export default DeviceScreen;
