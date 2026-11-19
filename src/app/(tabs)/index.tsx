import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard, Compass, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  useSubscriptionStore,
  UPCOMING_PRESETS,
  SubscriptionItem,
  formatCurrency,
} from '@/store/useSubscriptionStore';
import { useAppAuth } from '@/context/auth-context';
import { SubscriptionModal } from '@/components/subscription-modal';
import { BrandIcon } from '@/components/brand-icon';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAppAuth();
  const {
    subscriptions,
    balance,
    currency,
    initCurrency,
    fetchSubscriptions,
  } = useSubscriptionStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubForEdit, setSelectedSubForEdit] = useState<SubscriptionItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initCurrency();
    fetchSubscriptions(user?.id);
  }, [user?.id, fetchSubscriptions, initCurrency]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSubscriptions(user?.id);
    setRefreshing(false);
  };

  const handleOpenAdd = () => {
    setSelectedSubForEdit(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (sub: SubscriptionItem) => {
    setSelectedSubForEdit(sub);
    setModalVisible(true);
  };

  const displayName =
    user?.fullName ||
    (user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress.split('@')[0]
      : 'User');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFBF6' }} edges={['top', 'left', 'right']}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F1654C" />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'android' ? 24 : 10,
          paddingBottom: 130, // room for floating tab bar
        }}>
        {/* Top Header */}
        <View className="flex-row items-center justify-between py-3 mb-2">
          {/* User profile avatar & name */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-full bg-[#121722] items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <Text className="text-white font-black text-base">
                {displayName.charAt(0)}
              </Text>
            </View>
            <Text className="text-lg font-black text-slate-900 tracking-tight">
              {displayName}
            </Text>
          </TouchableOpacity>

          {/* Plus Add Button */}
          <TouchableOpacity
            onPress={handleOpenAdd}
            activeOpacity={0.8}
            className="w-11 h-11 rounded-full bg-white border border-slate-300 items-center justify-center shadow-xs">
            <Plus size={22} color="#0f172a" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Hero Card: Balance */}
        <View
          style={{ backgroundColor: '#F1654C' }}
          className="rounded-[28px] p-6 mb-7 shadow-lg shadow-orange-500/20">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-semibold text-white/90">Balance</Text>
            <Text className="text-sm font-medium text-white/80">03/18</Text>
          </View>

          <Text className="text-4xl font-black text-white tracking-tight">
            {formatCurrency(balance, currency)}
          </Text>
        </View>

        {/* Explore Apps Quick Discovery Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/explore')}
          className="bg-white rounded-2xl p-3.5 mb-6 border border-slate-200/90 shadow-xs flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 items-center justify-center mr-3">
              <Compass size={20} color="#F1654C" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-black text-slate-900">
                Explore Popular Apps
              </Text>
              <Text className="text-[10px] text-slate-500 font-medium">
                Discover 18+ streaming, AI & productivity plans
              </Text>
            </View>
          </View>
          <View className="flex-row items-center px-3 py-1.5 rounded-full bg-[#121722]">
            <Text className="text-[10px] font-black text-white mr-1">Explore</Text>
            <ArrowRight size={11} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Upcoming Section */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between mb-3.5">
            <Text className="text-lg font-black text-slate-900">Upcoming</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/subscriptions')}
              className="border border-slate-300 rounded-full px-3.5 py-1 bg-white shadow-xs">
              <Text className="text-xs font-semibold text-slate-700">View all</Text>
            </TouchableOpacity>
          </View>

          {/* Upcoming Horizontal Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            {UPCOMING_PRESETS.map((item) => (
              <View
                key={item.name}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 mr-3 w-36 shadow-xs justify-between">
                <View className="flex-row items-center justify-between mb-3">
                  <BrandIcon name={item.name} logoType={item.logoType as any} size={36} />
                  <View className="items-end">
                    <Text className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.price, currency)}
                    </Text>
                    <Text className="text-[10px] text-slate-400 font-medium">
                      {item.daysLeft}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-bold text-slate-900">{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* All Subscriptions Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3.5">
            <Text className="text-lg font-black text-slate-900">All Subscriptions</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/subscriptions')}
              className="border border-slate-300 rounded-full px-3.5 py-1 bg-white shadow-xs">
              <Text className="text-xs font-semibold text-slate-700">View all</Text>
            </TouchableOpacity>
          </View>

          {/* Subscriptions List (styled with pastel background cards) */}
          {subscriptions.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              activeOpacity={0.9}
              onPress={() => handleOpenEdit(sub)}
              style={{ backgroundColor: sub.cardColor || '#F7D267' }}
              className="rounded-2xl p-4 mb-3.5 shadow-xs">
              <View className="flex-row items-center justify-between">
                {/* Left Logo & Info */}
                <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                  <BrandIcon name={sub.name} logoType={sub.logoType} size={44} />

                  <View className="flex-1">
                    <Text className="text-base font-black text-slate-900" numberOfLines={1}>
                      {sub.name}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-0.5 flex-wrap">
                      <Text className="text-xs text-slate-700 font-medium">
                        {sub.category}
                      </Text>
                      {sub.paymentMethod && (
                        <>
                          <Text className="text-slate-500">•</Text>
                          <View className="flex-row items-center gap-1 bg-black/5 px-2 py-0.5 rounded-md">
                            <CreditCard size={10} color="#1e293b" />
                            <Text className="text-[10px] text-slate-800 font-bold">
                              {sub.paymentMethod}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                {/* Right Price & Cycle */}
                <View className="items-end">
                  <Text className="text-base font-black text-slate-900">
                    {formatCurrency(sub.price, currency)}
                  </Text>
                  <Text className="text-[11px] text-slate-700 font-medium capitalize mt-0.5">
                    {sub.billingCycle === 'monthly' ? 'Monthly' : sub.billingCycle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add / Edit Subscription Modal */}
      <SubscriptionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedSubForEdit(null);
        }}
        subscriptionToEdit={selectedSubForEdit}
      />
    </SafeAreaView>
  );
}
