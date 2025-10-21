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

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export function RegisterScreen({ navigation }: any) {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await register(values);
      Toast.show({ type: 'success', text1: 'Account created', text2: 'Welcome to the supportive circle!' });
    } catch (err) {
      const message = (err as Error).message ?? 'Could not create account';
      setError(message);
      Toast.show({ type: 'error', text1: 'Registration failed', text2: message });
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Join SambandhYog</Text>
        <Text style={styles.subtitle}>
          Build a circle of supportive professionals focused on uplifting growth.
        </Text>

        <Card>
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  label="Name"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                  placeholder="Your full name"
                />
              )}
            />

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
              rules={{ required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  label="Password"
                  value={value}
                  secureTextEntry
                  onChangeText={onChange}
                  error={error?.message}
                  placeholder="Secure password"
                />
              )}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Create account" onPress={onSubmit} loading={isLoading} />

            <Button
              title="I already have an account"
              variant="ghost"
              onPress={() => navigation.navigate('Login')}
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