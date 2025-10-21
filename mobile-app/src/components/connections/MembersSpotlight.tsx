import { useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useConnections } from '@/context/ConnectionsContext';

export function MembersSpotlight() {
  const {
    members,
    directoryQuery,
    isDirectoryLoading,
    requestFollow,
    acceptRequest,
    declineRequest,
    searchMembers
  } = useConnections();
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const topMembers = useMemo(() => members.slice(0, 6), [members]);

  const handleFollow = async (member: any) => {
    if (!member?.id) return;
    setPendingIds((set) => new Set(set).add(member.id));
    try {
      if (member.relationship === 'requested-you' && member.requestId) {
        await acceptRequest(member.requestId);
        Toast.show({ type: 'success', text1: 'Request accepted', text2: `You and ${member.name} are now connected.` });
      } else if (member.relationship !== 'following') {
        await requestFollow(member.id);
        Toast.show({ type: 'success', text1: 'Request sent', text2: `We let ${member.name} know you want to connect.` });
      }
      await searchMembers(directoryQuery);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Could not update follow status', text2: (error as Error).message });
    } finally {
      setPendingIds((set) => {
        const next = new Set(set);
        next.delete(member.id);
        return next;
      });
    }
  };

  const handleDecline = async (member: any) => {
    if (!member?.requestId) return;
    setPendingIds((set) => new Set(set).add(member.id));
    try {
      await declineRequest(member.requestId);
      Toast.show({ type: 'info', text1: 'Request declined' });
      await searchMembers(directoryQuery);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Could not decline request', text2: (error as Error).message });
    } finally {
      setPendingIds((set) => {
        const next = new Set(set);
        next.delete(member.id);
        return next;
      });
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Text style={styles.overline}>Members</Text>
          <Text style={styles.title}>Grow your circle</Text>
        </View>
        <Button title="Explore" variant="secondary" onPress={() => searchMembers('')} />
      </View>
      <View style={styles.list}>
        {isDirectoryLoading && !topMembers.length ? (
          <Text style={styles.stateText}>Loading members...</Text>
        ) : null}
        {topMembers.map((member) => {
          const isPending = pendingIds.has(member.id) || member.relationship === 'pending';
          const isFollowing = member.relationship === 'following';
          const requestedYou = member.relationship === 'requested-you';
          return (
            <View key={member.id} style={styles.memberRow}>
              <Avatar uri={member.avatarUrl} name={member.name} size={40} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberHandle}>@{member.username}</Text>
              </View>
              {isFollowing ? (
                <Text style={styles.following}>Following</Text>
              ) : requestedYou ? (
                <View style={styles.actions}>
                  <Button
                    title="Accept"
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onPress={() => handleFollow(member)}
                  />
                  <Button
                    title="Decline"
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onPress={() => handleDecline(member)}
                  />
                </View>
              ) : (
                <Button
                  title={isPending ? 'Requested' : 'Follow'}
                  size="sm"
                  variant={isPending ? 'secondary' : 'primary'}
                  disabled={isPending}
                  onPress={() => handleFollow(member)}
                />
              )}
            </View>
          );
        })}
        {!isDirectoryLoading && !topMembers.length ? (
          <Text style={styles.stateText}>No members to show yet. Visit explore to find new connections.</Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  overline: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#cbd5f5'
  },
  title: {
    fontSize: 17,
    color: '#f8fafc',
    fontWeight: '600'
  },
  list: {
    gap: 12
  },
  stateText: {
    color: '#94a3b8'
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    backgroundColor: 'rgba(148, 163, 184, 0.1)'
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  memberHandle: {
    color: '#94a3b8',
    fontSize: 12
  },
  following: {
    color: '#38bdf8',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  actions: {
    flexDirection: 'row',
    gap: 8
  }
});