import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { LogOut } from 'lucide-react-native';

interface ConfirmSignOutModalProps {
  visible: boolean;
  userName?: string | null;
  userEmail?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmSignOutModal({
  visible,
  userName,
  userEmail,
  onCancel,
  onConfirm,
}: ConfirmSignOutModalProps) {
  const displayName = userName || 'User';
  const displayEmail = userEmail || 'your account';

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
                  <LogOut size={26} color="#F1654C" />
                </View>
                <Text className="text-xl font-black text-slate-900 tracking-tight text-center">
                  Sign Out of Recurly?
                </Text>
                <Text className="text-xs text-slate-500 text-center mt-1 leading-5">
                  Are you sure you want to sign out? You will need to enter your email and password to access your subscriptions again.
                </Text>
              </View>

              {/* User Preview Card */}
              <View className="rounded-2xl p-3.5 mb-5 bg-white border border-slate-200/80 shadow-xs flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: '#F1654C' }}
                  className="w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-white text-base font-black">
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-slate-900" numberOfLines={1}>
                    {displayName}
                  </Text>
                  <Text className="text-xs text-slate-500 font-medium" numberOfLines={1}>
                    {displayEmail}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onCancel}
                  activeOpacity={0.75}
                  className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-300 items-center justify-center shadow-xs">
                  <Text className="text-sm font-bold text-slate-700">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  activeOpacity={0.85}
                  style={{ backgroundColor: '#F1654C' }}
                  className="flex-1 py-3.5 rounded-2xl items-center justify-center shadow-md shadow-orange-500/25">
                  <Text className="text-sm font-bold text-white">Yes, Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
