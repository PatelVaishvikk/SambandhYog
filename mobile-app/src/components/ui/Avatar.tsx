import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  name?: string;
  source?: ImageSourcePropType;
}

export function Avatar({ uri, size = 48, name = '', source }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (uri || source) {
    return (
      <Image
        source={source ?? { uri: uri ?? undefined }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}> 
      <Text style={styles.initials}>{initials || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)'
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)'
  },
  initials: {
    color: '#38bdf8',
    fontWeight: '700'
  }
});