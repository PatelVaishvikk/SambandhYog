import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminDashboardScreen } from '@/screens/admin/AdminDashboardScreen';
import { AdminUsersScreen } from '@/screens/admin/AdminUsersScreen';
import { AdminReportsScreen } from '@/screens/admin/AdminReportsScreen';

export type AdminStackParamList = {
  AdminHome: undefined;
  AdminUsers: undefined;
  AdminReports: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#020617' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: '600' }
      }}
    >
      <Stack.Screen name="AdminHome" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Members' }} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} options={{ title: 'Reports' }} />
    </Stack.Navigator>
  );
}