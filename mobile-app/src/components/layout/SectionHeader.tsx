import { StyleSheet, Text, View } from 'react-native';

interface SectionHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ overline, title, description, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {overline ? <Text style={styles.overline}>{overline}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  textContainer: {
    flex: 1,
    gap: 6
  },
  overline: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#cbd5f5'
  },
  title: {
    fontSize: 20,
    color: '#f8fafc',
    fontWeight: '700'
  },
  description: {
    fontSize: 14,
    color: '#94a3b8'
  }
});