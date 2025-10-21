import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: ReactNode;
}

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
  illustration
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {illustration}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel ? <Button title={actionLabel} variant="secondary" onPress={onAction} /> : null}
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
    color: '#f8fafc',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center'
  }
});