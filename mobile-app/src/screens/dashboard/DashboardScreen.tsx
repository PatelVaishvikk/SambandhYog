import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { PostComposer } from '@/components/posts/PostComposer';
import { PostList } from '@/components/posts/PostList';
import { MembersSpotlight } from '@/components/connections/MembersSpotlight';
import { useNotifications } from '@/context/NotificationContext';

export function DashboardScreen() {
  const { notifications } = useNotifications();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader />
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.overline}>Your feed</Text>
          <Text style={styles.title}>Celebrate purposeful progress</Text>
          <Text style={styles.subtitle}>
            Share milestones, reflect on lessons, and uplift the peers building kind careers alongside you.
          </Text>
        </View>
        <Card style={styles.statCard}>
          <Text style={styles.statOverline}>Live encouragement</Text>
          <Text style={styles.statValue}>{notifications.length}</Text>
          <Text style={styles.statSubtitle}>new cheers in your circle</Text>
        </Card>
      </View>

      <PostComposer />
      <PostList />
      <MembersSpotlight />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
    backgroundColor: '#020617'
  },
  hero: {
    flexDirection: 'column',
    gap: 16
  },
  heroText: {
    gap: 8
  },
  overline: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#cbd5f5'
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
  statCard: {
    gap: 6,
    maxWidth: 220
  },
  statOverline: {
    fontSize: 12,
    color: '#94a3b8',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: 28,
    color: '#f8fafc',
    fontWeight: '700'
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94a3b8'
  }
});