import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/context/AuthContext';

export function ProfileScreen() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    headline: user?.headline ?? '',
    bio: user?.bio ?? '',
    location: user?.location ?? '',
    website: user?.website ?? ''
  });
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sign in to view your profile.</Text>
      </View>
    );
  }

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError(null);
    try {
      await updateProfile(form);
      setIsEditing(false);
      Toast.show({ type: 'success', text1: 'Profile updated', text2: 'Your circle sees the new you.' });
    } catch (err) {
      const message = (err as Error).message ?? 'Could not update profile';
      setError(message);
      Toast.show({ type: 'error', text1: 'Update failed', text2: message });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.header}>
          <Avatar uri={user.avatarUrl} name={user.name} size={72} />
          <View style={styles.meta}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.headline}>{user.headline || 'Positive professional'}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            title={isEditing ? 'Cancel' : 'Edit profile'}
            variant="secondary"
            onPress={() => setIsEditing((prev) => !prev)}
          />
          <Button title="Log out" variant="ghost" onPress={logout} loading={isLoading} />
        </View>
      </Card>

      {isEditing ? (
        <Card>
          <View style={styles.form}>
            <TextField label="Name" value={form.name} onChangeText={(text) => handleChange('name', text)} />
            <TextField
              label="Headline"
              value={form.headline}
              onChangeText={(text) => handleChange('headline', text)}
              placeholder="What do you stand for?"
            />
            <TextField
              label="Bio"
              value={form.bio}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Share more about your journey"
              multiline
              style={styles.multiInput}
            />
            <TextField
              label="Location"
              value={form.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="City, Country"
            />
            <TextField
              label="Website"
              value={form.website}
              onChangeText={(text) => handleChange('website', text)}
              placeholder="https://example.com"
              autoCapitalize="none"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Save changes" onPress={handleSave} loading={isLoading} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.detail}>{user.bio || 'Share your story to invite meaningful connections.'}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{user.location || 'Add your city'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Website</Text>
            <Text style={styles.detailValue}>{user.website || 'Add a personal link'}</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 24,
    backgroundColor: '#020617'
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center'
  },
  meta: {
    gap: 4
  },
  name: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700'
  },
  username: {
    color: '#94a3b8'
  },
  headline: {
    color: '#38bdf8'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  form: {
    gap: 16
  },
  multiInput: {
    minHeight: 100
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600'
  },
  detail: {
    color: '#e2e8f0',
    lineHeight: 20
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  detailLabel: {
    color: '#94a3b8',
    fontWeight: '600'
  },
  detailValue: {
    color: '#f8fafc'
  },
  error: {
    color: '#fca5a5'
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617'
  },
  emptyText: {
    color: '#94a3b8'
  }
});