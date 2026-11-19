import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { SubscriptionItem, useSubscriptionStore, formatCurrency } from '@/store/useSubscriptionStore';
import { BrandIcon } from '@/components/brand-icon';

interface ConfirmDeleteModalProps {
  visible: boolean;
  subscription: SubscriptionItem | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  visible,
  subscription,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const { currency } = useSubscriptionStore();

  if (!subscription) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 bg-black/60 items-center justify-center p-5">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-sm bg-[#FEFBF6] rounded-[28px] p-6 shadow-2xl border border-slate-200">
              {/* Alert Badge Header */}
              <View className="items-center mb-4">
                <View className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 items-center justify-center mb-3">
                  <Trash2 size={26} color="#ef4444" />
                </View>
                <Text className="text-xl font-black text-slate-900 tracking-tight text-center">
                  Delete Subscription?
                </Text>
                <Text className="text-xs text-slate-500 text-center mt-1 leading-5">
                  Are you sure you want to delete this plan? This will remove it from your active subscriptions and calculations.
                </Text>
              </View>

              {/* Mini Item Preview Card */}
              <View
                style={{ backgroundColor: subscription.cardColor || '#F7D267' }}
                className="rounded-2xl p-3.5 mb-5 border border-black/5 shadow-xs flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1 mr-2">
                  <BrandIcon
                    name={subscription.name}
                    logoType={subscription.logoType}
                    size={38}
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-black text-slate-900" numberOfLines={1}>
                      {subscription.name}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <Text className="text-[11px] text-slate-700 font-semibold">
                        {subscription.category}
                      </Text>
                      {subscription.paymentMethod && (
                        <>
                          <Text className="text-slate-500 text-[10px]">•</Text>
                          <Text className="text-[10px] text-slate-700 font-medium">
                            {subscription.paymentMethod}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-sm font-black text-slate-900">
                    {formatCurrency(subscription.price, currency)}
                  </Text>
                  <Text className="text-[10px] text-slate-700 font-medium capitalize">
                    {subscription.billingCycle}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onCancel}
                  activeOpacity={0.75}
                  className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-300 items-center justify-center">
                  <Text className="text-sm font-bold text-slate-700">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  activeOpacity={0.85}
                  style={{ backgroundColor: '#ef4444' }}
                  className="flex-1 py-3.5 rounded-2xl items-center justify-center shadow-md shadow-rose-500/30">
                  <Text className="text-sm font-black text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
