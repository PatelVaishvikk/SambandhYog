import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#38bdf8" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});