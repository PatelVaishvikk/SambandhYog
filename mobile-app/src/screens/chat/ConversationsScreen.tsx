import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useConnections } from '@/context/ConnectionsContext';
import { formatRelativeTime } from '@/utils/date';

export function ConversationsScreen({ navigation }: any) {
  const { conversations } = useConnections();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
        renderItem={({ item }) => {
          const other = item.participants[1] ?? item.participants[0];
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('Chat', { conversationId: item.id, participant: other })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{other?.name?.charAt(0).toUpperCase() ?? '?'}</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.name}>{other?.name ?? 'Conversation'}</Text>
                <Text style={styles.preview}>{item.lastMessage?.content ?? 'Say hello and uplift them'}</Text>
              </View>
              <Text style={styles.timestamp}>{formatRelativeTime(item.updatedAt ?? item.lastMessage?.createdAt)}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700',
    marginBottom: 16
  },
  list: {
    gap: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#38bdf8',
    fontWeight: '700'
  },
  meta: {
    flex: 1
  },
  name: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  preview: {
    color: '#94a3b8',
    fontSize: 13
  },
  timestamp: {
    color: '#475569',
    fontSize: 12
  },
  empty: {
    color: '#94a3b8'
  }
});