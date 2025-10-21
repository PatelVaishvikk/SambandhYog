import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TextField } from '@/components/ui/TextField';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useConnections } from '@/context/ConnectionsContext';

const FEATURED_CATEGORIES = [
  'Mentors',
  'Career growth',
  'Community leaders',
  'Wellbeing advocates',
  'Product builders',
  'Tech for good'
];

export function ExploreScreen() {
  const { members, searchMembers, requestFollow, isDirectoryLoading } = useConnections();
  const [query, setQuery] = useState('');

  useEffect(() => {
    searchMembers('').catch(() => null);
  }, [searchMembers]);

  const handleSearch = (text: string) => {
    setQuery(text);
    searchMembers(text).catch(() => null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore the circle</Text>
      <Text style={styles.subtitle}>Discover uplifting peers and curated themes for career growth.</Text>

      <TextField
        placeholder="Search members by name, skill, or username"
        value={query}
        onChangeText={handleSearch}
      />

      <View style={styles.categories}>
        {FEATURED_CATEGORIES.map((category) => (
          <View key={category} style={styles.categoryChip}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          isDirectoryLoading ? (
            <Text style={styles.loading}>Searching the circle...</Text>
          ) : (
            <Text style={styles.loading}>No members found. Try a different search.</Text>
          )
        }
        renderItem={({ item }) => (
          <Card>
            <View style={styles.memberRow}>
              <Avatar uri={item.avatarUrl} name={item.name} size={48} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberHeadline}>{item.headline || 'Positive professional'}</Text>
              </View>
              <Button
                title="Connect"
                size="sm"
                variant="secondary"
                onPress={() => requestFollow(item.id)}
              />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 24,
    gap: 16
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
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  categoryText: {
    color: '#38bdf8',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  list: {
    gap: 16,
    paddingBottom: 80
  },
  loading: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  memberInfo: {
    flex: 1,
    gap: 4
  },
  memberName: {
    color: '#f8fafc',
    fontWeight: '600'
  },
  memberHeadline: {
    color: '#94a3b8'
  }
});