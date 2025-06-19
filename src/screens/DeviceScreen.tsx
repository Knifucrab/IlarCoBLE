import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DeviceScreen = ({ route }: any) => {
  const { device } = route.params;

  // Flatten device object into key-value pairs for FlatList
  const data = Object.entries(device).map(([key, value]) => ({
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
});

export default DeviceScreen;
