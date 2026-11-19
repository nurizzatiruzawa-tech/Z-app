import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const safeWidth = width && width > 0 ? width : 390;
  const artGridWidth = Math.min(safeWidth - 48, 420);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        minHeight: '100%',
        backgroundColor: '#F1654C',
        justifyContent: 'space-between',
      }}
      edges={['top', 'bottom', 'left', 'right']}>
      {/* Geometric Bauhaus Art Grid */}
      <View className="items-center justify-center pt-8 px-6">
        <View style={{ width: artGridWidth, height: artGridWidth * 0.95 }} className="flex-row flex-wrap rounded-3xl overflow-hidden shadow-2xl">
          {/* Row 1 */}
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#F1654C' }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#FEFBF6', borderBottomLeftRadius: 999 }} />
          </View>
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#A3C9B8', borderTopRightRadius: 999 }} />
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#1D263B' }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#F7D267', borderBottomRightRadius: 999 }} />
          </View>

          {/* Row 2 */}
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#A3C9B8' }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#FEFBF6', borderTopRightRadius: 999 }} />
          </View>
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#1D263B', borderRadius: 999 }} />
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#F7D267' }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#A3C9B8', borderTopLeftRadius: 999 }} />
          </View>

          {/* Row 3 */}
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#1D263B', borderBottomLeftRadius: 999 }} />
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#FEFBF6' }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#F1654C', borderTopRightRadius: 999 }} />
          </View>
          <View style={{ width: '33.33%', height: '33.33%', backgroundColor: '#A3C9B8', borderBottomRightRadius: 999 }} />
        </View>
      </View>

      {/* Bottom Content Area */}
      <View className="px-8 pb-10">
        <Text className="text-5xl font-black text-white tracking-tight leading-[52px]">
          Financial{'\n'}Clarity
        </Text>
        <Text className="text-base text-white/90 font-medium mt-3 mb-8">
          Analyze and cancel with ease
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.9}
          className="w-full py-4 rounded-full bg-white items-center justify-center shadow-lg shadow-black/20 mb-3">
          <Text className="text-slate-900 font-extrabold text-base">Get Started</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/sign-in')}
          className="items-center py-2">
          <Text className="text-xs font-bold text-white/80">Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
