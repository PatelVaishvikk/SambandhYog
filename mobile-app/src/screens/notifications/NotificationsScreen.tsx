import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useNotifications } from '@/context/NotificationContext';
import { formatRelativeTime } from '@/utils/date';

export function NotificationsScreen() {
  const { notifications, isLoading, markAllAsRead, markAsRead, removeNotification, fetchNotifications } =
    useNotifications();

  const renderItem = ({ item }: any) => (
    <Card>
      <View style={styles.itemHeader}>
        <View style={styles.iconBadge}>
          <Feather name="bell" size={16} color="#38bdf8" />
        </View>
        <Text style={[styles.timestamp, !item.read ? styles.unread : null]}>{formatRelativeTime(item.createdAt)}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.itemActions}>
        {!item.read ? (
          <Button title="Mark read" size="sm" variant="secondary" onPress={() => markAsRead(item.id)} />
        ) : null}
        <Button title="Dismiss" size="sm" variant="ghost" onPress={() => removeNotification(item.id)} />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Notifications</Text>
        <Button title="Mark all" variant="secondary" onPress={markAllAsRead} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          isLoading ? (
            <Spinner />
          ) : (
            <Text style={styles.empty}>You're all caught up! Check back soon for new cheers.</Text>
          )
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchNotifications()} tintColor="#38bdf8" />
        }
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700'
  },
  list: {
    gap: 16,
    paddingBottom: 80
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timestamp: {
    fontSize: 12,
    color: '#475569'
  },
  unread: {
    color: '#38bdf8'
  },
  message: {
    color: '#e2e8f0',
    marginTop: 12,
    fontSize: 15
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12
  },
  empty: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 40
  }
});