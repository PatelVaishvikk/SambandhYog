import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { usePosts } from '@/context/PostsContext';
import type { Post } from '@/types';
import { formatRelativeTime } from '@/utils/date';
import { CommentList } from '@/components/posts/CommentList';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { toggleReaction } = usePosts();

  const handleToggleReaction = async () => {
    try {
      await toggleReaction(post.id);
    } catch (error) {
      console.error('Toggle reaction', (error as Error).message);
    }
  };

  return (
    <Card interactive>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <Avatar uri={post.author?.avatarUrl} name={post.author?.name} size={48} />
          <View>
            <Text style={styles.authorName}>{post.author?.name}</Text>
            <Text style={styles.authorHeadline}>{post.author?.headline || 'Uplifting professional'}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{formatRelativeTime(post.createdAt)}</Text>
      </View>

      {post.title ? <Text style={styles.title}>{post.title}</Text> : null}
      <Text style={styles.content}>{post.content}</Text>

      {post.tags?.length ? (
        <View style={styles.tags}>
          {post.tags.map((tag) => (
            <Badge key={tag}>#{tag}</Badge>
          ))}
        </View>
      ) : null}

      <View style={styles.footer}>
        <Pressable style={styles.reactionButton} onPress={handleToggleReaction}>
          <Feather
            name={post.viewerHasLiked ? 'heart' : 'heart'}
            size={18}
            color={post.viewerHasLiked ? '#f472b6' : '#38bdf8'}
          />
          <Text style={styles.reactionText}>{post.likes ?? 0} cheers</Text>
        </Pressable>
      </View>

      <CommentList post={post} />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  authorName: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  authorHeadline: {
    color: '#94a3b8'
  },
  timestamp: {
    fontSize: 12,
    color: '#475569'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc'
  },
  content: {
    fontSize: 15,
    color: '#e2e8f0',
    lineHeight: 22
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  reactionText: {
    color: '#94a3b8'
  }
});