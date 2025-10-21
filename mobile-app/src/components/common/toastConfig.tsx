import { StyleSheet, Text, View } from 'react-native';
import type { ToastConfig } from 'react-native-toast-message';

const BaseToast = ({ text1, text2, style }: { text1?: string; text2?: string; style: any }) => (
  <View style={[styles.base, style]}>
    <Text style={styles.title}>{text1}</Text>
    {text2 ? <Text style={styles.message}>{text2}</Text> : null}
  </View>
);

export const toastConfig: ToastConfig = {
  success: (props) => <BaseToast {...props} style={styles.success} />,
  error: (props) => <BaseToast {...props} style={styles.error} />,
  info: (props) => <BaseToast {...props} style={styles.info} />
};

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)'
  },
  title: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  message: {
    color: '#94a3b8',
    marginTop: 4
  },
  success: {
    borderColor: 'rgba(34, 197, 94, 0.4)'
  },
  error: {
    borderColor: 'rgba(248, 113, 113, 0.5)'
  },
  info: {
    borderColor: 'rgba(56, 189, 248, 0.5)'
  }
});