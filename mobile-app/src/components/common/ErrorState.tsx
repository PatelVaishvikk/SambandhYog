import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>We hit a snag</Text>
      <Text style={styles.subtitle}>{message}</Text>
      {onRetry ? <Button title="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fca5a5'
  },
  subtitle: {
    fontSize: 14,
    color: '#fecaca',
    textAlign: 'center'
  }
});