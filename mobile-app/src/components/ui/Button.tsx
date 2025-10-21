import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        styles[`size_${size}`],
        styles[`variant_${variant}`],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed
      ]}
    >
      <>
        {loading ? (
          <ActivityIndicator color="#0f172a" size="small" style={styles.loader} />
        ) : (
          leftIcon ?? null
        )}
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
          {title}
        </Text>
        {!loading && rightIcon ? rightIcon : null}
      </>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 20,
    gap: 8
  },
  loader: {
    marginRight: 8
  },
  label: {
    fontWeight: '600'
  },
  label_primary: {
    color: '#0f172a'
  },
  label_secondary: {
    color: '#e2e8f0'
  },
  label_outline: {
    color: '#e2e8f0'
  },
  label_ghost: {
    color: '#e2e8f0'
  },
  labelSize_sm: {
    fontSize: 12
  },
  labelSize_md: {
    fontSize: 14
  },
  labelSize_lg: {
    fontSize: 16
  },
  size_sm: {
    height: 34,
    paddingHorizontal: 16
  },
  size_md: {
    height: 44
  },
  size_lg: {
    height: 52
  },
  variant_primary: {
    backgroundColor: '#38bdf8'
  },
  variant_secondary: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)'
  },
  variant_outline: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)'
  },
  variant_ghost: {
    backgroundColor: 'transparent'
  },
  disabled: {
    opacity: 0.5
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  }
});