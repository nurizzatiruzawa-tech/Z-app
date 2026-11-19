import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  PlusCircle,
  Pencil,
  CreditCard,
  Calendar,
  Check,
} from 'lucide-react-native';
import {
  useSubscriptionStore,
  SUBSCRIPTION_CATEGORIES,
  POPULAR_PRESETS,
  PAYMENT_METHODS,
  SubscriptionItem,
  getCurrencySymbol,
} from '@/store/useSubscriptionStore';
import { useAppAuth } from '@/context/auth-context';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  subscriptionToEdit?: SubscriptionItem | null;
}

const PASTEL_COLORS = [
  { name: 'Yellow', value: '#F7D267' },
  { name: 'Sky Blue', value: '#BFDCF6' },
  { name: 'Mint', value: '#C4E4D8' },
  { name: 'Soft Green', value: '#D7F0DC' },
  { name: 'Cream', value: '#EFE8DE' },
  { name: 'Ice Blue', value: '#D8E8F8' },
  { name: 'Rose', value: '#FEE2E2' },
];

function SubscriptionForm({
  subscriptionToEdit,
  onClose,
}: {
  subscriptionToEdit?: SubscriptionItem | null;
  onClose: () => void;
}) {
  const { user } = useAppAuth();
  const { addSubscription, updateSubscription, currency: globalCurrency } = useSubscriptionStore();

  const isEditMode = Boolean(subscriptionToEdit);

  const initialPayment = subscriptionToEdit?.paymentMethod || 'Visa •••• 4242';
  const isPresetPayment = PAYMENT_METHODS.includes(initialPayment as any);

  const [name, setName] = useState(subscriptionToEdit?.name || '');
  const [price, setPrice] = useState(subscriptionToEdit ? subscriptionToEdit.price.toString() : '');
  const [category, setCategory] = useState(subscriptionToEdit?.category || 'Entertainment');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    subscriptionToEdit?.billingCycle === 'yearly' ? 'yearly' : 'monthly'
  );
  const [renewalDate, setRenewalDate] = useState(subscriptionToEdit?.renewalDate || '2026-11-25');
  const [remindDaysBefore, setRemindDaysBefore] = useState(subscriptionToEdit?.remindDaysBefore || 3);
  const [paymentMethod, setPaymentMethod] = useState(isPresetPayment ? initialPayment : 'Custom');
  const [customPaymentMethod, setCustomPaymentMethod] = useState(isPresetPayment ? '' : initialPayment);
  const [showCustomPayment, setShowCustomPayment] = useState(!isPresetPayment);
  const [notes, setNotes] = useState(subscriptionToEdit?.notes || '');
  const [iconColor, setIconColor] = useState(subscriptionToEdit?.iconColor || '#6366f1');
  const [cardColor, setCardColor] = useState(subscriptionToEdit?.cardColor || '#BFDCF6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyPreset = (preset: (typeof POPULAR_PRESETS)[0]) => {
    setName(preset.name);
    setPrice(preset.price.toString());
    setCategory(preset.category);
    setBillingCycle(preset.billingCycle as 'monthly' | 'yearly');
    setRenewalDate(preset.renewalDate);
    setRemindDaysBefore(preset.remindDaysBefore);
    setIconColor(preset.iconColor);
    setCardColor(preset.cardColor || '#BFDCF6');
    setPaymentMethod(preset.paymentMethod || 'Visa •••• 4242');
    setShowCustomPayment(false);
    setCustomPaymentMethod('');
    setNotes(preset.notes || '');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter subscription name.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid subscription price.');
      return;
    }

    const finalPaymentMethod = showCustomPayment
      ? customPaymentMethod.trim() || 'Custom'
      : paymentMethod;

    setIsSubmitting(true);
    try {
      if (isEditMode && subscriptionToEdit) {
        await updateSubscription(subscriptionToEdit.id, {
          name: name.trim(),
          price: parsedPrice,
          category,
          billingCycle,
          renewalDate,
          remindDaysBefore,
          paymentMethod: finalPaymentMethod,
          iconColor,
          cardColor,
          notes: notes.trim() || null,
        });
      } else {
        await addSubscription(
          {
            name: name.trim(),
            price: parsedPrice,
            currency: globalCurrency,
            category,
            billingCycle,
            renewalDate,
            remindDaysBefore,
            paymentMethod: finalPaymentMethod,
            iconColor,
            cardColor,
            daysLeft: 14,
            notes: notes.trim() || null,
            isActive: true,
          },
          user?.id
        );
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-[#FEFBF6] border-t border-slate-200 rounded-t-[32px] max-h-[92%] p-6 shadow-2xl">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
        <View className="flex-row items-center gap-2.5">
          <View
            style={{ backgroundColor: '#F1654C' }}
            className="w-9 h-9 rounded-full items-center justify-center shadow-xs">
            {isEditMode ? (
              <Pencil size={18} color="#FFFFFF" />
            ) : (
              <PlusCircle size={18} color="#FFFFFF" />
            )}
          </View>
          <Text className="text-xl font-black text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Subscription' : 'Add Subscription'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-slate-200/80 items-center justify-center">
          <X size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        {/* Quick Presets (Only in Create Mode) */}
        {!isEditMode && (
          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-600 mb-2">
              Popular Services
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {POPULAR_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => handleApplyPreset(preset)}
                  className="mr-2 px-3 py-2 rounded-xl bg-white border border-slate-300 flex-row items-center gap-2 shadow-xs">
                  <View
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: preset.iconColor }}
                  />
                  <Text className="text-xs text-slate-800 font-bold">{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Subscription Name */}
        <View className="mb-3.5">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">Service Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Netflix, Spotify, Adobe"
            placeholderTextColor="#94a3b8"
            className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 text-sm shadow-xs"
          />
        </View>

        {/* Price & Billing Cycle */}
        <View className="flex-row gap-3 mb-3.5">
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-700 mb-1.5">Price</Text>
            <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 shadow-xs">
              <Text className="text-slate-600 font-black text-sm mr-1.5">
                {getCurrencySymbol(globalCurrency)}
              </Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="14.99"
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                className="flex-1 py-3 text-slate-900 text-sm font-semibold"
              />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-700 mb-1.5">Billing Cycle</Text>
            <View className="flex-row bg-slate-200/70 rounded-2xl p-1">
              <TouchableOpacity
                onPress={() => setBillingCycle('monthly')}
                style={{ backgroundColor: billingCycle === 'monthly' ? '#F1654C' : 'transparent' }}
                className="flex-1 py-2 items-center rounded-xl">
                <Text
                  className={`text-xs font-bold ${
                    billingCycle === 'monthly' ? 'text-white' : 'text-slate-600'
                  }`}>
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBillingCycle('yearly')}
                style={{ backgroundColor: billingCycle === 'yearly' ? '#F1654C' : 'transparent' }}
                className="flex-1 py-2 items-center rounded-xl">
                <Text
                  className={`text-xs font-bold ${
                    billingCycle === 'yearly' ? 'text-white' : 'text-slate-600'
                  }`}>
                  Yearly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Method Selector */}
        <View className="mb-3.5">
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <CreditCard size={14} color="#F1654C" />
            <Text className="text-xs font-bold text-slate-700">Payment Method</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = !showCustomPayment && paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  onPress={() => {
                    setPaymentMethod(method);
                    setShowCustomPayment(false);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#121722' : '#FFFFFF',
                    borderColor: isSelected ? '#121722' : '#CBD5E1',
                  }}
                  className="mr-2 px-3.5 py-1.5 rounded-full border shadow-xs flex-row items-center gap-1.5">
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-700'
                    }`}>
                    {method}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => setShowCustomPayment(true)}
              style={{
                backgroundColor: showCustomPayment ? '#121722' : '#FFFFFF',
                borderColor: showCustomPayment ? '#121722' : '#CBD5E1',
              }}
              className="mr-2 px-3.5 py-1.5 rounded-full border shadow-xs">
              <Text
                className={`text-xs font-bold ${
                  showCustomPayment ? 'text-white' : 'text-slate-700'
                }`}>
                + Custom
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {showCustomPayment && (
            <TextInput
              value={customPaymentMethod}
              onChangeText={setCustomPaymentMethod}
              placeholder="Enter custom card or payment (e.g. Maybank, Touch 'n Go)"
              placeholderTextColor="#94a3b8"
              className="bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-slate-900 text-xs mt-2 shadow-xs"
            />
          )}
        </View>

        {/* Category Select */}
        <View className="mb-3.5">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            {SUBSCRIPTION_CATEGORIES.filter((c) => c.id !== 'All').map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={{
                    backgroundColor: isSelected ? '#121722' : '#FFFFFF',
                    borderColor: isSelected ? '#121722' : '#CBD5E1',
                  }}
                  className="mr-2 px-3.5 py-1.5 rounded-full border shadow-xs">
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-700'
                    }`}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Card Background Color Accent */}
        <View className="mb-3.5">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">Card Theme</Text>
          <View className="flex-row gap-2.5">
            {PASTEL_COLORS.map((c) => {
              const isSelected = cardColor === c.value;
              return (
                <TouchableOpacity
                  key={c.value}
                  onPress={() => setCardColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className="w-8 h-8 rounded-full border border-slate-300 items-center justify-center shadow-xs">
                  {isSelected && <Check size={14} color="#0f172a" strokeWidth={3} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Renewal Date */}
        <View className="mb-3.5">
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <Calendar size={14} color="#F1654C" />
            <Text className="text-xs font-bold text-slate-700">Next Renewal Date</Text>
          </View>
          <TextInput
            value={renewalDate}
            onChangeText={setRenewalDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94a3b8"
            className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 text-sm shadow-xs"
          />
        </View>

        {/* Reminder Days */}
        <View className="mb-3.5">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">
            Remind Me Before Renewal
          </Text>
          <View className="flex-row gap-2">
            {[1, 2, 3, 5, 7].map((days) => {
              const isSelected = remindDaysBefore === days;
              return (
                <TouchableOpacity
                  key={days}
                  onPress={() => setRemindDaysBefore(days)}
                  style={{
                    backgroundColor: isSelected ? '#F1654C' : '#FFFFFF',
                    borderColor: isSelected ? '#F1654C' : '#CBD5E1',
                  }}
                  className="flex-1 py-2 rounded-xl items-center border shadow-xs">
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-700'
                    }`}>
                    {days}d
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">Notes (Optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Plan details, card used, etc."
            placeholderTextColor="#94a3b8"
            className="bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 text-sm shadow-xs"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting}
          style={{ backgroundColor: '#F1654C' }}
          activeOpacity={0.85}
          className="w-full py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
          <Text className="text-white font-extrabold text-base">
            {isSubmitting
              ? 'Saving...'
              : isEditMode
              ? 'Save Changes'
              : 'Add to Recurly'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function SubscriptionModal({
  visible,
  onClose,
  subscriptionToEdit,
}: SubscriptionModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/60">
        {visible && (
          <SubscriptionForm
            key={subscriptionToEdit ? `edit-${subscriptionToEdit.id}` : 'create'}
            subscriptionToEdit={subscriptionToEdit}
            onClose={onClose}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}
