import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useConnections } from '@/context/ConnectionsContext';

export function ConnectionsScreen() {
  const {
    followers,
    requests,
    outgoing,
    followBack,
    acceptRequest,
    declineRequest
  } = useConnections();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connections</Text>
      <Text style={styles.subtitle}>Respond to follow requests and nurture your circle.</Text>

      <Card>
        <Text style={styles.sectionTitle}>Incoming requests</Text>
        {requests.length ? (
          requests.map((request) => (
            <View key={request.id} style={styles.row}>
              <Avatar uri={request.user.avatarUrl} name={request.user.name} size={44} />
              <View style={styles.info}>
                <Text style={styles.name}>{request.user.name}</Text>
                <Text style={styles.handle}>@{request.user.username}</Text>
              </View>
              <View style={styles.actions}>
                <Button
                  title="Accept"
                  size="sm"
                  variant="secondary"
                  onPress={() => acceptRequest(request.id)}
                />
                <Button
                  title="Decline"
                  size="sm"
                  variant="ghost"
                  onPress={() => declineRequest(request.id)}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No pending requests right now.</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Following you</Text>
        {followers.length ? (
          followers.map((user) => (
            <View key={user.id} style={styles.row}>
              <Avatar uri={user.avatarUrl} name={user.name} size={44} />
              <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.handle}>@{user.username}</Text>
              </View>
              <Button title="Follow back" size="sm" onPress={() => followBack(user.id)} />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>Keep spreading kindness to grow your circle.</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Awaiting acceptance</Text>
        {outgoing.length ? (
          outgoing.map((request) => (
            <View key={request.id} style={styles.row}>
              <Avatar uri={request.user.avatarUrl} name={request.user.name} size={44} />
              <View style={styles.info}>
                <Text style={styles.name}>{request.user.name}</Text>
                <Text style={styles.handle}>@{request.user.username}</Text>
              </View>
              <Text style={styles.pending}>Pending</Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No outgoing requests.</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 18,
    backgroundColor: '#020617'
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
  sectionTitle: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '600',
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8
  },
  info: {
    flex: 1
  },
  name: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  handle: {
    color: '#94a3b8'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  },
  empty: {
    color: '#94a3b8'
  },
  pending: {
    color: '#38bdf8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 12
  }
});