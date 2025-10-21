import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { PostCard } from '@/components/posts/PostCard';
import { usePosts } from '@/context/PostsContext';

export function PostList() {
  const { posts, isLoading, error, fetchPosts } = usePosts();

  useEffect(() => {
    if (!posts.length) {
      fetchPosts().catch(() => null);
    }
  }, []);

  if (isLoading && !posts.length) {
    return (
      <Card>
        <View style={styles.loadingRow}>
          <Spinner />
        </View>
      </Card>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchPosts()} />;
  }

  if (!posts.length) {
    return (
      <EmptyState
        title="No posts yet"
        subtitle="Share your first achievement to inspire the community."
        actionLabel="Refresh feed"
        onAction={() => fetchPosts()}
      />
    );
  }

  return (
    <View style={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {isLoading ? (
        <View style={styles.loadingMore}>
          <Spinner />
        </View>
      ) : null}
      {!isLoading ? (
        <View style={styles.footer}>
          <Button title="Refresh" variant="secondary" onPress={() => fetchPosts()} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16
  },
  loadingRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  loadingMore: {
    alignItems: 'center',
    paddingVertical: 16
  },
  footer: {
    alignItems: 'center'
  }
});