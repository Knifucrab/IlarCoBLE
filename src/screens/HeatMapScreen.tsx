import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { Alert } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.max(screenWidth, 500);

const placeholderData = [
  { date: '2024-04-01', count: 12 },
  { date: '2024-04-02', count: 18 },
  { date: '2024-04-03', count: 22 },
  { date: '2024-04-04', count: 15 },
  { date: '2024-04-05', count: 25 },
  { date: '2024-04-06', count: 30 },
  { date: '2024-04-07', count: 28 },
  { date: '2024-04-08', count: 20 },
  { date: '2024-04-09', count: 17 },
  { date: '2024-04-10', count: 19 },
  { date: '2024-04-11', count: 23 },
  { date: '2024-04-12', count: 27 },
  { date: '2024-04-13', count: 32 },
  { date: '2024-04-14', count: 29 },
  { date: '2024-04-15', count: 21 },
  { date: '2024-04-16', count: 24 },
  { date: '2024-04-17', count: 26 },
  { date: '2024-04-18', count: 31 },
  { date: '2024-04-19', count: 34 },
  { date: '2024-04-20', count: 36 },
  { date: '2024-04-21', count: 38 },
  { date: '2024-04-22', count: 40 },
  { date: '2024-04-23', count: 35 },
  { date: '2024-04-24', count: 33 },
  { date: '2024-04-25', count: 30 },
  { date: '2024-04-26', count: 28 },
  { date: '2024-04-27', count: 25 },
  { date: '2024-04-28', count: 22 },
  { date: '2024-04-29', count: 20 },
  { date: '2024-04-30', count: 18 },
  // May
  { date: '2024-05-01', count: 19 },
  { date: '2024-05-02', count: 21 },
  { date: '2024-05-03', count: 23 },
  { date: '2024-05-04', count: 26 },
  { date: '2024-05-05', count: 29 },
  { date: '2024-05-06', count: 31 },
  { date: '2024-05-07', count: 33 },
  { date: '2024-05-08', count: 35 },
  { date: '2024-05-09', count: 37 },
  { date: '2024-05-10', count: 39 },
  { date: '2024-05-11', count: 41 },
  { date: '2024-05-12', count: 43 },
  { date: '2024-05-13', count: 45 },
  { date: '2024-05-14', count: 47 },
  { date: '2024-05-15', count: 49 },
  { date: '2024-05-16', count: 48 },
  { date: '2024-05-17', count: 46 },
  { date: '2024-05-18', count: 44 },
  { date: '2024-05-19', count: 42 },
  { date: '2024-05-20', count: 40 },
  { date: '2024-05-21', count: 38 },
  { date: '2024-05-22', count: 36 },
  { date: '2024-05-23', count: 34 },
  { date: '2024-05-24', count: 32 },
  { date: '2024-05-25', count: 30 },
  { date: '2024-05-26', count: 28 },
  { date: '2024-05-27', count: 26 },
  { date: '2024-05-28', count: 24 },
  { date: '2024-05-29', count: 22 },
  { date: '2024-05-30', count: 20 },
  { date: '2024-05-31', count: 18 },
  // June
  { date: '2024-06-01', count: 21 },
  { date: '2024-06-02', count: 23 },
  { date: '2024-06-03', count: 25 },
  { date: '2024-06-04', count: 27 },
  { date: '2024-06-05', count: 29 },
  { date: '2024-06-06', count: 31 },
  { date: '2024-06-07', count: 33 },
  { date: '2024-06-08', count: 35 },
  { date: '2024-06-09', count: 37 },
  { date: '2024-06-10', count: 39 },
  { date: '2024-06-11', count: 41 },
  { date: '2024-06-12', count: 43 },
  { date: '2024-06-13', count: 45 },
  { date: '2024-06-14', count: 47 },
  { date: '2024-06-15', count: 49 },
  { date: '2024-06-16', count: 48 },
  { date: '2024-06-17', count: 46 },
  { date: '2024-06-18', count: 44 },
  { date: '2024-06-19', count: 42 },
  { date: '2024-06-20', count: 40 },
  { date: '2024-06-21', count: 38 },
  { date: '2024-06-22', count: 36 },
  { date: '2024-06-23', count: 34 },
  { date: '2024-06-24', count: 32 },
  { date: '2024-06-25', count: 30 },
  { date: '2024-06-26', count: 28 },
  { date: '2024-06-27', count: 26 },
  { date: '2024-06-28', count: 24 },
  { date: '2024-06-29', count: 22 },
  { date: '2024-06-30', count: 20 },
  // July
  { date: '2024-07-01', count: 19 },
  { date: '2024-07-02', count: 21 },
  { date: '2024-07-03', count: 23 },
  { date: '2024-07-04', count: 25 },
  { date: '2024-07-05', count: 27 },
  { date: '2024-07-06', count: 29 },
  { date: '2024-07-07', count: 31 },
  { date: '2024-07-08', count: 33 },
  { date: '2024-07-09', count: 35 },
  { date: '2024-07-10', count: 37 },
  { date: '2024-07-11', count: 39 },
  { date: '2024-07-12', count: 41 },
  { date: '2024-07-13', count: 43 },
  { date: '2024-07-14', count: 45 },
  { date: '2024-07-15', count: 47 },
  { date: '2024-07-16', count: 49 },
  { date: '2024-07-17', count: 48 },
  { date: '2024-07-18', count: 46 },
  { date: '2024-07-19', count: 44 },
  { date: '2024-07-20', count: 42 },
  { date: '2024-07-21', count: 40 },
  { date: '2024-07-22', count: 38 },
  { date: '2024-07-23', count: 36 },
  { date: '2024-07-24', count: 34 },
  { date: '2024-07-25', count: 32 },
  { date: '2024-07-26', count: 30 },
  { date: '2024-07-27', count: 28 },
  { date: '2024-07-28', count: 26 },
  { date: '2024-07-29', count: 24 },
  { date: '2024-07-30', count: 22 },
  { date: '2024-07-31', count: 20 },
];

const HeatMapScreen = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.bigTitle}>Quarterly Heart Counter Activity</Text>
    <Text style={styles.header}>Daily Heart Count Heat Map (Apr-Jul 2024)</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.centeredView}>
        <ContributionGraph
          values={placeholderData}
          endDate={new Date('2024-07-31')}
          numDays={122}
          width={chartWidth}
          height={320}
          chartConfig={{
            backgroundColor: '#181A20',
            backgroundGradientFrom: '#181A20',
            backgroundGradientTo: '#181A20',
            color: (opacity = 1) => `rgba(219, 80, 70, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          tooltipDataAttrs={(value) => ({
            onPress: () => {
              alert(
                `Date: ${
                  value.date instanceof Date
                    ? value.date.toISOString().split('T')[0]
                    : value.date
                }\nCount: ${value.value}`
              );
            },
          })}
        />
      </View>
    </ScrollView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    padding: 16,
  },
  bigTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  centeredView: {
    alignItems: 'center',
  },
});

export default HeatMapScreen;
function alert(message: string) {
  Alert.alert('Info', message);
}
