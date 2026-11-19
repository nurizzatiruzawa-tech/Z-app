import { Tabs } from 'expo-router';
import { Home, Compass, ShoppingBag, TrendingUp, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomMargin = Math.max(insets.bottom, 16);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: '#FEFBF6' },
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomMargin,
          left: 16,
          right: 16,
          height: 64,
          backgroundColor: '#121722',
          borderRadius: 32,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          paddingHorizontal: 6,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarItemStyle: {
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 0,
          paddingHorizontal: 0,
          margin: 0,
        },
        tabBarIconStyle: {
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused ? '#F1654C' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Home size={22} color={focused ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused ? '#F1654C' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Compass size={22} color={focused ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused ? '#F1654C' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ShoppingBag size={22} color={focused ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused ? '#F1654C' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TrendingUp size={22} color={focused ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: focused ? '#F1654C' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Settings size={22} color={focused ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
