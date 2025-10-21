import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';

export function AppHeader() {
  const { user } = useAuth();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>SambandhYog</Text>
        <Text style={styles.subtitle}>Celebrate purposeful progress</Text>
      </View>
      <Avatar uri={user?.avatarUrl} name={user?.name} size={44} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8'
  }
});