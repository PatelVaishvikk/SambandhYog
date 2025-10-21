import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { AppProviders } from '@/providers/AppProviders';
import { RootNavigator } from '@/navigation/RootNavigator';
import { toastConfig } from '@/components/common/toastConfig';

SplashScreen.preventAutoHideAsync().catch(() => null);

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => null);
  }, []);

  return (
    <SafeAreaProvider>
      <AppProviders>
        <RootNavigator />
        <Toast config={toastConfig} position="top" />
        <StatusBar style="light" />
      </AppProviders>
    </SafeAreaProvider>
  );
}