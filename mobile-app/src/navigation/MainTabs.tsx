import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { FeedStack } from '@/navigation/FeedStack';
import { ExploreScreen } from '@/screens/explore/ExploreScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { ConnectionsScreen } from '@/screens/connections/ConnectionsScreen';
import { AdminStack } from '@/navigation/AdminStack';
import { useAuth } from '@/context/AuthContext';

export type MainTabParamList = {
  Feed: undefined;
  Explore: undefined;
  Connections: undefined;
  Notifications: undefined;
  Profile: undefined;
  Admin?: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: 'rgba(148, 163, 184, 0.15)'
        },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#475569',
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Feather.glyphMap> = {
            Feed: 'home',
            Explore: 'compass',
            Connections: 'users',
            Notifications: 'bell',
            Profile: 'user',
            Admin: 'shield'
          };
          return <Feather name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.isAdmin ? <Tab.Screen name="Admin" component={AdminStack} /> : null}
    </Tab.Navigator>
  );
}