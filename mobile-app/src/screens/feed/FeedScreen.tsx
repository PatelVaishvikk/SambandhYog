import { ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { MembersSpotlight } from '@/components/connections/MembersSpotlight';
import { PostComposer } from '@/components/posts/PostComposer';
import { PostList } from '@/components/posts/PostList';
import { Button } from '@/components/ui/Button';

export function FeedScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader />
      <View style={styles.quickActions}>
        <Button title="Dashboard" variant="secondary" onPress={() => navigation.navigate('Dashboard')} />
        <Button title="Messages" variant="secondary" onPress={() => navigation.navigate('Conversations')} />
      </View>
      <PostComposer />
      <PostList />
      <View style={styles.sidebar}>
        <MembersSpotlight />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 20,
    backgroundColor: '#020617'
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12
  },
  sidebar: {
    paddingBottom: 48
  }
});