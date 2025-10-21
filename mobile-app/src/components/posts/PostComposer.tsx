import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { usePosts } from '@/context/PostsContext';
import { useAuth } from '@/context/AuthContext';

const MAX_LENGTH = 400;

export function PostComposer() {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <Card>
        <Text style={styles.hint}>Log in to share your milestones with the community.</Text>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await addPost({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      Toast.show({ type: 'success', text1: 'Post shared', text2: 'Your milestone is now inspiring the circle.' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Could not share post', text2: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.overline}>Share a milestone</Text>
        <Text style={styles.counter}>{content.length}/{MAX_LENGTH}</Text>
      </View>
      <Text style={styles.title}>Inspire the circle with your progress</Text>
      <TextField
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Share a win, lesson, or resource"
        maxLength={120}
      />
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Post content</Text>
        <TextInput
          placeholder="Celebrate a milestone, ask for guidance, or share a reflection."
          placeholderTextColor="rgba(148, 163, 184, 0.6)"
          style={styles.textArea}
          multiline
          value={content}
          onChangeText={setContent}
          maxLength={MAX_LENGTH}
        />
      </View>
      <View style={styles.actions}>
        <Button title={isSubmitting ? 'Posting...' : 'Share update'} onPress={handleSubmit} loading={isSubmitting} disabled={!content.trim()} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  overline: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#cbd5f5'
  },
  counter: {
    fontSize: 12,
    color: '#94a3b8'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc'
  },
  fieldGroup: {
    gap: 8
  },
  label: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#94a3b8'
  },
  textArea: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#f8fafc',
    paddingHorizontal: 18,
    paddingVertical: 16,
    minHeight: 160,
    textAlignVertical: 'top'
  },
  actions: {
    alignItems: 'flex-end'
  },
  hint: {
    color: '#94a3b8',
    fontSize: 14
  }
});