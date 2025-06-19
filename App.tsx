import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ConnectDeviceScreen from './src/screens/ConnectDeviceScreen';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <ConnectDeviceScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
