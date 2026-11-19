import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MessageSquarePlus, X, Send } from 'lucide-react-native';
import { useAppAuth } from '@/context/auth-context';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Feedback', 'Bug Report', 'Feature Request'];

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const { user } = useAppAuth();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Required', 'Please enter your feedback message');
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          rating,
          category,
          message,
        }),
      });
      Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
      setMessage('');
      onClose();
    } catch {
      Alert.alert('Thank You!', 'Your feedback has been noted.');
      setMessage('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/60 justify-end">
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#FEFBF6' }} className="rounded-t-3xl p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
            <View className="flex-row items-center gap-2.5">
              <View
                style={{ backgroundColor: '#F1654C' }}
                className="w-10 h-10 rounded-xl items-center justify-center">
                <MessageSquarePlus color="#FFFFFF" size={20} />
              </View>
              <View>
                <Text className="text-xl font-bold text-slate-900">Give Feedback</Text>
                <Text className="text-xs text-slate-500">Help us improve Recurly</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-slate-200/70">
              <X size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View className="py-4 items-center">
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Rate your experience
            </Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-1">
                  <Star
                    size={28}
                    color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                    fill={star <= rating ? '#f59e0b' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categories */}
          <View className="py-2">
            <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Feedback Category
            </Text>
            <View className="flex-row gap-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={{
                    backgroundColor: category === cat ? '#121722' : '#FFFFFF',
                    borderColor: category === cat ? '#121722' : '#CBD5E1',
                  }}
                  className="px-3.5 py-2 rounded-xl border text-center shadow-xs">
                  <Text
                    className={`text-xs font-bold ${
                      category === cat ? 'text-white' : 'text-slate-700'
                    }`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Message Input */}
          <View className="py-3">
            <TextInput
              className="bg-white border border-slate-300 rounded-2xl p-4 text-slate-900 text-sm h-28 shadow-xs"
              placeholder="Tell us what you like or what could be improved..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: '#F1654C' }}
            className="py-4 rounded-full flex-row items-center justify-center gap-2 mt-2 shadow-lg shadow-orange-500/30">
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Send size={16} color="white" />
                <Text className="text-white font-bold text-base">Submit Feedback</Text>
              </>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
