import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginScreen({ navigation }: any) {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      Toast.show({ type: 'success', text1: 'Welcome back', text2: 'Great to see your progress again.' });
    } catch (err) {
      const message = (err as Error).message ?? 'Could not log in';
      setError(message);
      Toast.show({ type: 'error', text1: 'Login failed', text2: message });
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Continue cultivating meaningful professional connections.
        </Text>

        <Card>
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{ required: 'Email is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  label="Email"
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onChangeText={onChange}
                  error={error?.message}
                  placeholder="you@example.com"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  label="Password"
                  value={value}
                  secureTextEntry
                  onChangeText={onChange}
                  error={error?.message}
                  placeholder="••••••••"
                />
              )}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Sign in" onPress={onSubmit} loading={isLoading} />

            <Button
              title="Create a new account"
              variant="secondary"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617'
  },
  content: {
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 28,
    color: '#f8fafc',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8'
  },
  form: {
    gap: 18
  },
  error: {
    color: '#fca5a5',
    fontSize: 13
  }
});