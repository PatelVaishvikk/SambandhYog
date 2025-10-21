import { useEffect, useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { useConnections } from '@/context/ConnectionsContext';
import { formatRelativeTime } from '@/utils/date';

export function ChatScreen({ route }: any) {
  const { conversationId, participant } = route.params ?? {};
  const { conversations, sendMessage, openConversation } = useConnections();
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const conversation = useMemo(
    () => conversations.find((item) => item.id === conversationId),
    [conversations, conversationId]
  );

  useEffect(() => {
    if (conversation && (conversation as any).messages) {
      setMessages((conversation as any).messages);
    } else if (conversation?.lastMessage) {
      setMessages([conversation.lastMessage]);
    }
  }, [conversation]);

  useEffect(() => {
    if (!conversation && participant?.id) {
      openConversation(participant.id).then((next) => {
        if ((next as any)?.messages) {
          setMessages((next as any).messages);
        } else if (next?.lastMessage) {
          setMessages([next.lastMessage]);
        }
      });
    }
  }, [conversation, participant, openConversation]);

  const handleSend = async () => {
    if (!content.trim()) return;
    setIsSending(true);
    try {
      const updated = await sendMessage({
        conversationId,
        recipientId: participant?.id,
        content: content.trim()
      });
      if (updated) {
        if ((updated as any).messages) {
          setMessages((updated as any).messages);
        } else if (updated.lastMessage) {
          setMessages((prev) => [...prev, updated.lastMessage]);
        }
      }
      setContent('');
    } catch (error) {
      console.error('Send message', (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{participant?.name?.charAt(0)?.toUpperCase() ?? '?'}</Text>
        </View>
        <View>
          <Text style={styles.name}>{participant?.name ?? 'Conversation'}</Text>
          <Text style={styles.subtitle}>Keep the exchange encouraging and constructive.</Text>
        </View>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.id ?? `msg-${index}`}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageAuthor}>{item.sender?.name ?? 'Member'}</Text>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.messageTimestamp}>{formatRelativeTime(item.createdAt)}</Text>
          </View>
        )}
      />
      <View style={styles.composer}>
        <Feather name="message-circle" size={20} color="#38bdf8" />
        <TextInput
          style={styles.input}
          placeholder="Send thoughtful encouragement"
          placeholderTextColor="rgba(148, 163, 184, 0.7)"
          value={content}
          multiline
          onChangeText={setContent}
        />
        <Button
          title="Send"
          size="sm"
          variant="secondary"
          onPress={handleSend}
          loading={isSending}
          disabled={!content.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '700'
  },
  name: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600'
  },
  subtitle: {
    color: '#94a3b8'
  },
  messages: {
    flexGrow: 1,
    gap: 12
  },
  messageBubble: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)'
  },
  messageAuthor: {
    color: '#38bdf8',
    fontWeight: '600'
  },
  messageContent: {
    color: '#f8fafc',
    marginTop: 6
  },
  messageTimestamp: {
    color: '#475569',
    fontSize: 12,
    marginTop: 6
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 12
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10
  }
});