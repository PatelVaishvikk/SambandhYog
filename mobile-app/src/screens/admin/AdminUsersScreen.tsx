import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

const USERS = [
  { id: 'user_1', name: 'Neha Kapoor', status: 'Active', role: 'Member' },
  { id: 'user_2', name: 'Kabir Joshi', status: 'Pending review', role: 'Mentor' },
  { id: 'user_3', name: 'Asha Varma', status: 'Suspended', role: 'Member' }
];

export function AdminUsersScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community members</Text>
      <Text style={styles.subtitle}>Review account status and roles across the network.</Text>

      <Card>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.cellName]}>Name</Text>
          <Text style={styles.cell}>Role</Text>
          <Text style={[styles.cell, styles.alignRight]}>Status</Text>
        </View>
        {USERS.map((user) => (
          <View key={user.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.cellName, styles.cellValue]}>{user.name}</Text>
            <Text style={[styles.cell, styles.cellValue]}>{user.role}</Text>
            <Text style={[styles.cell, styles.alignRight, styles.status]}>{user.status}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#020617',
    gap: 16
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8'
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.05)'
  },
  cell: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 13
  },
  cellName: {
    flex: 1.4
  },
  cellValue: {
    color: '#f8fafc'
  },
  alignRight: {
    textAlign: 'right'
  },
  status: {
    color: '#38bdf8',
    fontWeight: '600'
  }
});