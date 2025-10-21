import { Appearance, ColorSchemeName } from 'react-native';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeContextValue {
  colorScheme: ColorSchemeName;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? 'dark'
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: next }) => {
      if (!next) return;
      setColorScheme(next);
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo<ThemeContextValue>(
    () => ({ colorScheme, isDark: colorScheme === 'dark', toggleTheme }),
    [colorScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
}