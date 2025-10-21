import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '@/screens/feed/FeedScreen';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { ConversationsScreen } from '@/screens/chat/ConversationsScreen';
import { ChatScreen } from '@/screens/chat/ChatScreen';

export type FeedStackParamList = {
  FeedHome: undefined;
  Dashboard: undefined;
  Conversations: undefined;
  Chat: { conversationId?: string; participant?: any } | undefined;
};

const Stack = createNativeStackNavigator<FeedStackParamList>();

export function FeedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#020617' },
        headerTintColor: '#f8fafc'
      }}
    >
      <Stack.Screen name="FeedHome" component={FeedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Conversations" component={ConversationsScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Conversation' }} />
    </Stack.Navigator>
  );
}