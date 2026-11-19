import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PieChart,
  Lightbulb,
} from 'lucide-react-native';
import {
  useSubscriptionStore,
  SUBSCRIPTION_CATEGORIES,
  formatCurrency,
} from '@/store/useSubscriptionStore';
import { BrandIcon } from '@/components/brand-icon';

export default function InsightsScreen() {
  const { subscriptions, getTotalMonthlySpend, getTotalYearlySpend, currency } = useSubscriptionStore();

  const monthlyTotal = getTotalMonthlySpend();
  const yearlyTotal = getTotalYearlySpend();

  // Category breakdown
  const categoryStats = SUBSCRIPTION_CATEGORIES.filter((c) => c.id !== 'All').map((cat) => {
    const catSubs = subscriptions.filter((s) => s.category === cat.id && s.isActive);
    const catTotal = catSubs.reduce((sum, s) => {
      const monthlyPrice = s.billingCycle === 'yearly' ? s.price / 12 : s.price;
      return sum + monthlyPrice;
    }, 0);

    const percentage = monthlyTotal > 0 ? Math.round((catTotal / monthlyTotal) * 100) : 0;
    return {
      ...cat,
      count: catSubs.length,
      total: catTotal,
      percentage,
    };
  }).filter((c) => c.count > 0).sort((a, b) => b.total - a.total);

  // Top spenders
  const topSpenders = [...subscriptions]
    .filter((s) => s.isActive)
    .sort((a, b) => {
      const priceA = a.billingCycle === 'yearly' ? a.price / 12 : a.price;
      const priceB = b.billingCycle === 'yearly' ? b.price / 12 : b.price;
      return priceB - priceA;
    })
    .slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFBF6' }} edges={['top', 'left', 'right']}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'android' ? 24 : 12,
          paddingBottom: 130,
        }}>
        {/* Header */}
        <View className="pb-4">
          <View className="flex-row items-center gap-2 mb-1">
            <PieChart size={24} color="#F1654C" />
            <Text className="text-2xl font-black text-slate-900 tracking-tight">
              Monthly Insights
            </Text>
          </View>
          <Text className="text-xs text-slate-500 font-medium">
            Spending distributions, metrics and subscription analytics
          </Text>
        </View>

        {/* Overview Stats */}
        <View className="flex-row gap-3.5 mb-5">
          <View className="flex-1 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <Text className="text-xs font-semibold text-slate-400 mb-1">Monthly Total</Text>
            <Text className="text-2xl font-black text-slate-900">
              {formatCurrency(monthlyTotal, currency)}
            </Text>
            <Text className="text-[10px] text-orange-600 mt-1 font-bold">Active plans</Text>
          </View>

          <View className="flex-1 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <Text className="text-xs font-semibold text-slate-400 mb-1">Annual Estimate</Text>
            <Text className="text-2xl font-black text-slate-900">
              {formatCurrency(yearlyTotal, currency)}
            </Text>
            <Text className="text-[10px] text-emerald-600 mt-1 font-bold">12-month outlook</Text>
          </View>
        </View>

        {/* Smart Tip Banner */}
        <View className="mb-5 p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center">
            <Lightbulb size={20} color="#F1654C" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-orange-900">Optimization Tip</Text>
            <Text className="text-[11px] text-orange-800 mt-0.5 leading-4 font-medium">
              Switching your monthly Adobe and streaming subscriptions to annual cycles can save you up to 18% per year.
            </Text>
          </View>
        </View>

        {/* Spending by Category */}
        <View className="mb-6 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <Text className="text-base font-black text-slate-900 mb-4">Breakdown by Category</Text>

          {categoryStats.length === 0 ? (
            <Text className="text-xs text-slate-400 text-center py-4">
              Add subscriptions to view category breakdown.
            </Text>
          ) : (
            categoryStats.map((cat) => (
              <View key={cat.id} className="mb-4">
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Text className="text-xs font-bold text-slate-800">{cat.label}</Text>
                    <Text className="text-[10px] text-slate-400">({cat.count} plans)</Text>
                  </View>
                  <Text className="text-xs font-black text-slate-900">
                    {formatCurrency(cat.total, currency)} ({cat.percentage}%)
                  </Text>
                </View>

                {/* Progress bar */}
                <View className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Top 3 Spenders */}
        <View className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs mb-6">
          <Text className="text-base font-black text-slate-900 mb-3">Highest Cost Subscriptions</Text>

          {topSpenders.map((sub, idx) => (
            <View
              key={sub.id}
              className={`flex-row items-center justify-between py-2.5 ${
                idx !== topSpenders.length - 1 ? 'border-b border-slate-100' : ''
              }`}>
              <View className="flex-row items-center gap-3 flex-1 mr-2">
                <Text className="text-sm font-extrabold text-slate-400">#{idx + 1}</Text>
                <BrandIcon name={sub.name} logoType={sub.logoType} size={36} />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{sub.name}</Text>
                  <View className="flex-row items-center gap-1.5 mt-0.5">
                    <Text className="text-[10px] text-slate-500 font-medium">{sub.category}</Text>
                    {sub.paymentMethod && (
                      <>
                        <Text className="text-slate-400 text-[10px]">•</Text>
                        <Text className="text-[10px] text-slate-600 font-semibold">{sub.paymentMethod}</Text>
                      </>
                    )}
                  </View>
                </View>
              </View>

              <Text className="text-sm font-black text-slate-900">
                {formatCurrency(sub.price, currency)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
