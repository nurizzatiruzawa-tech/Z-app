import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSignIn } from '@/context/clerk-adapter';
import * as WebBrowser from 'expo-web-browser';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import { useAppAuth } from '@/context/auth-context';

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; registered?: string }>();
  const { isClerkConfigured, signInAsGuest, setUserProfile } = useAppAuth();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState(params.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(
    params.registered === 'true'
      ? 'Account created successfully! Please sign in with your email and password.'
      : null
  );

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    if (!isClerkConfigured || !isLoaded || !signIn) {
      // Local fallback
      await setUserProfile({
        email: email.trim(),
        name: email.trim().split('@')[0],
        isLoggedIn: true,
      });
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await setUserProfile({
          email: email.trim(),
          isLoggedIn: true,
        });
        router.replace('/(tabs)');
      } else {
        setErrorMessage('Verification required. Please check your account.');
      }
    } catch (err: any) {
      const errCode = err.errors?.[0]?.code;
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Sign in failed. Please check credentials.';

      if (errCode === 'session_exists') {
        router.replace('/(tabs)');
        return;
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    signInAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFBF6' }} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 20 }}>
          {/* Logo Header */}
          <View className="flex-row items-center justify-center gap-3 mb-10">
            <View
              style={{ backgroundColor: '#F1654C' }}
              className="w-12 h-12 rounded-2xl items-center justify-center shadow-md shadow-orange-500/20">
              <Text className="text-white font-black text-2xl">R</Text>
            </View>
            <View>
              <Text className="text-2xl font-black text-slate-900 tracking-tight">Recurly</Text>
              <Text className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                SMART BILLING
              </Text>
            </View>
          </View>

          {/* Heading */}
          <View className="mb-8">
            <Text className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</Text>
            <Text className="text-sm text-slate-500 mt-1.5">
              Sign in to continue managing your subscriptions
            </Text>
          </View>

          {/* Success Banner */}
          {successMessage && (
            <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex-row items-center gap-2.5 mb-5">
              <CheckCircle2 size={18} color="#059669" />
              <Text className="text-xs text-emerald-800 flex-1 font-semibold">{successMessage}</Text>
            </View>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex-row items-center gap-2.5 mb-5">
              <AlertCircle size={18} color="#f43f5e" />
              <Text className="text-xs text-rose-700 flex-1 font-medium">{errorMessage}</Text>
            </View>
          )}

          {/* Form */}
          <View className="gap-4 mb-6">
            <View>
              <Text className="text-xs font-bold text-slate-700 mb-2">Email</Text>
              <TextInput
                className="bg-white border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-900 shadow-xs"
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-bold text-slate-700">Password</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/(auth)/forgot-password',
                      params: { email: email.trim() },
                    })
                  }>
                  <Text style={{ color: '#F1654C' }} className="text-xs font-bold">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-4 shadow-xs">
                <TextInput
                  className="flex-1 py-3.5 text-sm text-slate-900"
                  placeholder="Enter your password (min. 8 characters)"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            style={{ backgroundColor: '#F1654C' }}
            activeOpacity={0.85}
            className="w-full py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Guest / Demo Option */}
          <TouchableOpacity
            onPress={handleGuestContinue}
            activeOpacity={0.8}
            className="flex-row items-center justify-center gap-2 py-3 rounded-full border border-slate-300 bg-white shadow-xs mb-6">
            <Sparkles size={16} color="#F1654C" />
            <Text className="text-xs font-bold text-slate-700">Continue as Demo Guest</Text>
          </TouchableOpacity>

          {/* Footer Navigation */}
          <View className="flex-row items-center justify-center">
            <Text className="text-xs text-slate-500">New to Recurly? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={{ color: '#F1654C' }} className="text-xs font-bold">
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
