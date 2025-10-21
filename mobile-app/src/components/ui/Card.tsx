import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
  children: ReactNode;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style, interactive = false, ...props }: CardProps) {
  return (
    <View
      style={StyleSheet.flatten([styles.card, interactive ? styles.interactive : null, style])}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 20,
    gap: 16
  },
  interactive: {
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6
  }
});