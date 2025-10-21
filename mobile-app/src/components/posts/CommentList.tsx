import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View
} from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import type { Post, PostComment } from '@/types';
import { formatRelativeTime } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostsContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CommentListProps {
  post: Post;
}

export function CommentList({ post }: CommentListProps) {
  const { user } = useAuth();
  const { addComment } = usePosts();
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(post.id, content.trim());
      setContent('');
      setExpanded(true);
    } catch (error) {
      console.error('Add comment', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const comments = expanded ? post.comments ?? [] : (post.comments ?? []).slice(0, 1);

  return (
    <View style={styles.container}>
      <Pressable style={styles.toggleRow} onPress={toggleExpanded}>
        <View style={styles.toggleLabel}>
          <Feather name="message-circle" size={18} color="#38bdf8" />
          <Text style={styles.toggleText}>
            {post.commentsCount ?? post.comments?.length ?? 0} reflections
          </Text>
        </View>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#94a3b8" />
      </Pressable>

      {comments.map((comment: PostComment) => (
        <View key={comment.id} style={styles.commentItem}>
          <Avatar uri={comment.author.avatarUrl} name={comment.author.name} size={32} />
          <View style={styles.commentBody}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{comment.author.name}</Text>
              <Text style={styles.commentTimestamp}>{formatRelativeTime(comment.createdAt)}</Text>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        </View>
      ))}

      {user ? (
        <View style={styles.composer}>
          <Avatar uri={user.avatarUrl} name={user.name} size={32} />
          <TextInput
            style={styles.input}
            placeholder="Share an encouraging reflection"
            placeholderTextColor="rgba(148, 163, 184, 0.7)"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <Button
            title="Send"
            variant="secondary"
            size="sm"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!content.trim()}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  toggleText: {
    color: '#94a3b8'
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12
  },
  commentBody: {
    flex: 1,
    gap: 4
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  commentAuthor: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  commentTimestamp: {
    color: '#475569',
    fontSize: 12
  },
  commentContent: {
    color: '#e2e8f0',
    fontSize: 14
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  input: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    color: '#f8fafc',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10
  }
});