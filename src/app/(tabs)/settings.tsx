import { ConfirmSignOutModal } from '@/components/confirm-sign-out-modal';
import { useAppAuth } from '@/context/auth-context';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { useRouter } from 'expo-router';
import {
  Bell,
  Info,
  LogIn,
  LogOut
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isSignedIn, signOut } = useAppAuth();
  const { currency, setCurrency, initCurrency } = useSubscriptionStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

  React.useEffect(() => {
    initCurrency();
  }, [initCurrency]);

  const displayName =
    user?.fullName ||
    (user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress.split('@')[0]
      : 'Guest User');
  const email = user?.primaryEmailAddress?.emailAddress || 'guest@recurly.app';

  const handleConfirmSignOut = async () => {
    setSignOutModalVisible(false);
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFBF6' }} edges={['top', 'left', 'right']}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'android' ? 24 : 12,
          paddingBottom: 130, // extra breathing room for floating tab bar
        }}>
        {/* Header */}
        <View className="pb-4">
          <Text className="text-2xl font-black text-slate-900 tracking-tight">Settings</Text>
          <Text className="text-xs text-slate-500 font-medium">Account, preferences, and notifications</Text>
        </View>

        {/* User Card */}
        <View className="p-5 rounded-3xl bg-white border border-slate-200/90 mb-5 shadow-xs">
          <View className="flex-row items-center gap-3.5 mb-4">
            <View
              style={{ backgroundColor: '#F1654C' }}
              className="w-14 h-14 rounded-2xl items-center justify-center shadow-md shadow-orange-500/20">
              <Text className="text-white text-xl font-black">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-base font-black text-slate-900">{displayName}</Text>
              <Text className="text-xs text-slate-500 font-medium">{email}</Text>
              <View className="flex-row items-center gap-1.5 mt-1.5">
                <View className="bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  <Text style={{ color: '#F1654C' }} className="text-[10px] font-bold">
                    {isSignedIn ? 'Active Account' : 'Guest Account'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sign Out / Sign In Actions */}
          {isSignedIn ? (
            <TouchableOpacity
              onPress={() => setSignOutModalVisible(true)}
              activeOpacity={0.8}
              className="py-3 rounded-full bg-rose-50 border border-rose-200 flex-row items-center justify-center gap-2 shadow-xs">
              <LogOut size={16} color="#ef4444" />
              <Text className="text-xs font-bold text-rose-600">Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <View className="gap-2">
              <TouchableOpacity
                onPress={() => router.push('/(auth)/sign-in')}
                activeOpacity={0.85}
                style={{ backgroundColor: '#F1654C' }}
                className="py-3 rounded-full flex-row items-center justify-center gap-2 shadow-sm shadow-orange-500/20">
                <LogIn size={16} color="white" />
                <Text className="text-xs font-bold text-white">Sign In to Recurly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSignOutModalVisible(true)}
                activeOpacity={0.8}
                className="py-2.5 rounded-full bg-slate-100 border border-slate-200 flex-row items-center justify-center gap-2">
                <LogOut size={14} color="#64748b" />
                <Text className="text-xs font-semibold text-slate-600">Reset Session</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notifications & Reminders */}
        <View className="p-5 rounded-3xl bg-white border border-slate-200/90 mb-5 shadow-xs">
          <View className="flex-row items-center gap-2 mb-3.5">
            <Bell size={18} color="#F1654C" />
            <Text className="text-sm font-black text-slate-900">Renewal Alerts</Text>
          </View>

          <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
            <View>
              <Text className="text-xs font-bold text-slate-900">Push Notifications</Text>
              <Text className="text-[10px] text-slate-500">Alerts before renewal dates</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e2e8f0', true: '#F1654C' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="flex-row items-center justify-between py-2 mt-2">
            <View>
              <Text className="text-xs font-bold text-slate-900">Email Digest</Text>
              <Text className="text-[10px] text-slate-500">Monthly expense breakdown summary</Text>
            </View>
            <Switch
              value={emailAlertsEnabled}
              onValueChange={setEmailAlertsEnabled}
              trackColor={{ false: '#e2e8f0', true: '#F1654C' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* About App */}
        <View className="p-5 rounded-3xl bg-white border border-slate-200/90 mb-6 shadow-xs">
          <View className="flex-row items-center gap-2 mb-2">
            <Info size={18} color="#F1654C" />
            <Text className="text-sm font-black text-slate-900">About Recurly</Text>
          </View>
          <Text className="text-xs text-slate-500 leading-5">
            A payment model where customers pay a recurring fee at set intervals (such as weekly, monthly, or annually) in exchange for ongoing access to a product, service, or digital content
          </Text>
          <View className="flex-row items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
            <Text className="text-xs text-slate-400">Version</Text>
            <Text className="text-xs text-slate-700 font-bold">1.0.0 (JS Mastery 2026)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Sign Out Modal */}
      <ConfirmSignOutModal
        visible={signOutModalVisible}
        userName={displayName}
        userEmail={email}
        onCancel={() => setSignOutModalVisible(false)}
        onConfirm={handleConfirmSignOut}
      />
    </SafeAreaView>
  );
}
