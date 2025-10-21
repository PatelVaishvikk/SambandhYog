import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

const REPORTS = [
  {
    id: 'report_1',
    category: 'Content moderation',
    summary: 'Post flagged for negative sentiment',
    submittedBy: 'Priya Sharma',
    status: 'Open'
  },
  {
    id: 'report_2',
    category: 'Harassment',
    summary: 'Direct message reported for inappropriate tone',
    submittedBy: 'Rahul Singh',
    status: 'In review'
  }
];

export function AdminReportsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community reports</Text>
      <Text style={styles.subtitle}>Address open reports to keep the circle supportive.</Text>

      {REPORTS.map((report) => (
        <Card key={report.id}>
          <Text style={styles.category}>{report.category}</Text>
          <Text style={styles.summary}>{report.summary}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Submitted by</Text>
            <Text style={styles.metaValue}>{report.submittedBy}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.status}>{report.status}</Text>
          </View>
        </Card>
      ))}

      <Card>
        <Text style={styles.guidelinesTitle}>Escalation guidelines</Text>
        <Text style={styles.guidelinesBody}>
          Escalate harassment within 24 hours, remove harmful content swiftly, and acknowledge members who model uplifting behaviour.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#020617',
    gap: 18
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
  category: {
    fontSize: 13,
    color: '#38bdf8',
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  summary: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  metaLabel: {
    color: '#94a3b8',
    fontWeight: '600'
  },
  metaValue: {
    color: '#f8fafc'
  },
  status: {
    color: '#fbbf24',
    fontWeight: '700'
  },
  guidelinesTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600'
  },
  guidelinesBody: {
    color: '#e2e8f0',
    lineHeight: 20
  }
});