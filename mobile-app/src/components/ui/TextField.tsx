import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const TextField = forwardRef<TextInput, InputProps>(function TextField(
  { label, error, style, ...props },
  ref
) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor="rgba(226, 232, 240, 0.5)"
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(148, 163, 184, 0.8)',
    marginBottom: 6
  },
  input: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#f8fafc',
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15
  },
  inputError: {
    borderColor: '#f87171'
  },
  error: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: 6
  }
});