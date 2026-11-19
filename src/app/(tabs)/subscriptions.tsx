import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  PauseCircle,
  Pencil,
  CreditCard,
} from 'lucide-react-native';
import {
  useSubscriptionStore,
  SUBSCRIPTION_CATEGORIES,
  SubscriptionItem,
  formatCurrency,
} from '@/store/useSubscriptionStore';
import { SubscriptionModal } from '@/components/subscription-modal';
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal';
import { BrandIcon } from '@/components/brand-icon';

export default function SubscriptionsScreen() {
  const {
    subscriptions,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeFilter,
    setActiveFilter,
    toggleActive,
    deleteSubscription,
    currency,
  } = useSubscriptionStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubForEdit, setSelectedSubForEdit] = useState<SubscriptionItem | null>(null);
  const [selectedSubForDelete, setSelectedSubForDelete] = useState<SubscriptionItem | null>(null);

  const filtered = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus =
      activeFilter === 'all' ||
      (activeFilter === 'active' && sub.isActive) ||
      (activeFilter === 'inactive' && !sub.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setSelectedSubForEdit(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (sub: SubscriptionItem) => {
    setSelectedSubForEdit(sub);
    setModalVisible(true);
  };

  const handleOpenDelete = (sub: SubscriptionItem) => {
    setSelectedSubForDelete(sub);
  };

  const handleConfirmDelete = () => {
    if (selectedSubForDelete) {
      deleteSubscription(selectedSubForDelete.id);
      setSelectedSubForDelete(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFBF6' }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }} className="px-5 pt-3">
        {/* Header */}
        <View className="flex-row items-center justify-between pb-3">
          <View>
            <Text className="text-2xl font-black text-slate-900 tracking-tight">Subscriptions</Text>
            <Text className="text-xs text-slate-500 font-medium">
              Manage all active and cancelled recurring plans
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleOpenAdd}
            style={{ backgroundColor: '#F1654C' }}
            className="w-11 h-11 rounded-full items-center justify-center shadow-md shadow-orange-500/30">
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-4 py-3 mb-3 shadow-xs">
          <Search size={18} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-2 text-sm text-slate-900 font-medium"
            placeholder="Search subscriptions by name..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text className="text-xs font-bold text-slate-400">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs (All / Active / Inactive) */}
        <View className="flex-row bg-[#F0ECE1] p-1 rounded-full mb-3">
          {(['all', 'active', 'inactive'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={{ backgroundColor: activeFilter === filter ? '#FFFFFF' : 'transparent' }}
              className="flex-1 py-2 items-center rounded-full shadow-xs">
              <Text
                style={{ color: activeFilter === filter ? '#F1654C' : '#64748b' }}
                className="text-xs font-bold uppercase tracking-wider">
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Filter Horizontal */}
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            {SUBSCRIPTION_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={{
                    backgroundColor: isSelected ? '#F1654C' : '#FFFFFF',
                    borderColor: isSelected ? '#F1654C' : '#E2E8F0',
                  }}
                  className="mr-2 px-4 py-1.5 rounded-full border shadow-xs">
                  <Text
                    style={{ color: isSelected ? '#FFFFFF' : '#475569' }}
                    className="text-xs font-bold">
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Subscriptions List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          {filtered.length === 0 ? (
            <View className="p-10 rounded-3xl bg-white border border-slate-200 items-center justify-center mt-4">
              <Text className="text-base font-bold text-slate-900 mt-2">No matching subscriptions</Text>
              <Text className="text-xs text-slate-400 text-center mt-1">
                Try adjusting your search query or filters.
              </Text>
            </View>
          ) : (
            filtered.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                activeOpacity={0.9}
                onPress={() => handleOpenEdit(sub)}
                style={{ backgroundColor: sub.cardColor || '#FFFFFF' }}
                className={`mb-3.5 p-4 rounded-2xl border border-slate-200/50 shadow-xs ${
                  sub.isActive ? 'opacity-100' : 'opacity-60'
                }`}>
                {/* Top Row: Brand, Title, Category, Price */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                    <BrandIcon name={sub.name} logoType={sub.logoType} size={42} />

                    <View className="flex-1">
                      <Text className="text-base font-black text-slate-900" numberOfLines={1}>
                        {sub.name}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-0.5">
                        <Text className="text-xs text-slate-700 font-semibold">{sub.category}</Text>
                        <Text className="text-slate-500">•</Text>
                        <Text className="text-xs text-slate-700 capitalize">{sub.billingCycle}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-base font-black text-slate-900">
                      {formatCurrency(sub.price, currency)}
                    </Text>
                    <Text className="text-[10px] text-slate-600 font-medium capitalize mt-0.5">
                      {sub.billingCycle === 'monthly' ? 'Monthly' : sub.billingCycle}
                    </Text>
                  </View>
                </View>

                {/* Bottom Row: Payment Method Badge & Action Buttons */}
                <View className="flex-row items-center justify-between pt-2.5 border-t border-black/5 mt-1">
                  {/* Payment Method Badge */}
                  <View className="flex-row items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-lg">
                    <CreditCard size={12} color="#1e293b" />
                    <Text className="text-[11px] font-bold text-slate-800">
                      {sub.paymentMethod || 'Visa •••• 4242'}
                    </Text>
                  </View>

                  {/* Actions: Edit, Pause/Activate, Delete */}
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded-lg bg-white/80 border border-slate-300">
                      <Pencil size={15} color="#475569" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => toggleActive(sub.id)}
                      className="p-1.5 rounded-lg bg-white/80 border border-slate-300">
                      {sub.isActive ? (
                        <CheckCircle2 size={16} color="#16a34a" />
                      ) : (
                        <PauseCircle size={16} color="#94a3b8" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleOpenDelete(sub)}
                      className="p-1.5 rounded-lg bg-white/80 border border-slate-300">
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Add / Edit Subscription Modal */}
      <SubscriptionModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedSubForEdit(null);
        }}
        subscriptionToEdit={selectedSubForEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        visible={Boolean(selectedSubForDelete)}
        subscription={selectedSubForDelete}
        onCancel={() => setSelectedSubForDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
