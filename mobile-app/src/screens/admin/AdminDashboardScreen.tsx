import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/context/NotificationContext';
import { usePosts } from '@/context/PostsContext';

export function AdminDashboardScreen({ navigation }: any) {
  const { notifications } = useNotifications();
  const { posts } = usePosts();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin overview</Text>
      <Text style={styles.subtitle}>Monitor health metrics and ensure our circle stays positive.</Text>

      <View style={styles.grid}>
        <Card>
          <Text style={styles.metricLabel}>Total posts</Text>
          <Text style={styles.metricValue}>{posts.length}</Text>
        </Card>
        <Card>
          <Text style={styles.metricLabel}>Notifications</Text>
          <Text style={styles.metricValue}>{notifications.length}</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Moderation toolkit</Text>
        <View style={styles.actions}>
          <Button title="Manage users" variant="secondary" onPress={() => navigation.navigate('AdminUsers')} />
          <Button title="Review reports" variant="secondary" onPress={() => navigation.navigate('AdminReports')} />
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Moderation guidelines</Text>
        <Text style={styles.body}>
          Encourage constructive feedback, flag harmful content promptly, and celebrate members who uplift others.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#020617',
    gap: 18
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
  grid: {
    flexDirection: 'row',
    gap: 12
  },
  metricLabel: {
    fontSize: 13,
    color: '#94a3b8',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  metricValue: {
    fontSize: 28,
    color: '#f8fafc',
    fontWeight: '700'
  },
  sectionTitle: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '600',
    marginBottom: 12
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  },
  body: {
    color: '#e2e8f0',
    lineHeight: 20
  }
});