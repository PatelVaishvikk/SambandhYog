import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  children: ReactNode;
  tone?: 'brand' | 'neutral' | 'success';
}

export function Badge({ children, tone = 'brand' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[`tone_${tone}`]]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1
  },
  tone_brand: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.4)'
  },
  tone_neutral: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.3)'
  },
  tone_success: {
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)'
  },
  text: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2
  }
});