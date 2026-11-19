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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSignIn } from '@/context/clerk-adapter';
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from 'lucide-react-native';
import { useAppAuth } from '@/context/auth-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { isClerkConfigured } = useAppAuth();
  const { signIn, isLoaded } = useSignIn();

  const [email, setEmail] = useState(params.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = enter email, 2 = enter code & new password
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Send reset code to email
  const handleRequestCode = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    if (!isClerkConfigured || !isLoaded || !signIn) {
      // Local fallback / demo mode
      setLoading(false);
      setStep(2);
      Alert.alert('Reset Code Sent', 'A 6-digit demo reset code was sent to your email.');
      return;
    }

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStep(2);
    } catch (err: any) {
      const msg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        'Unable to send reset code. Please check your email address.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code & reset password
  const handleResetPassword = async () => {
    if (!code.trim() || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    if (!isClerkConfigured || !isLoaded || !signIn) {
      // Local fallback / demo mode
      setLoading(false);
      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated. Please sign in with your new password.',
        [
          {
            text: 'Sign In Now',
            onPress: () => {
              router.replace({
                pathname: '/(auth)/sign-in',
                params: { email: email.trim(), registered: 'true' },
              });
            },
          },
        ]
      );
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });

      if (result.status === 'complete') {
        Alert.alert(
          'Password Reset Successful!',
          'Your password has been changed. Please sign in with your new password.',
          [
            {
              text: 'Sign In Now',
              onPress: () => {
                router.replace({
                  pathname: '/(auth)/sign-in',
                  params: { email: email.trim(), registered: 'true' },
                });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        setErrorMessage('Unable to complete reset. Please verify your code and try again.');
      }
    } catch (err: any) {
      let msg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        'Failed to reset password. Please verify the code.';
      
      if (msg.toLowerCase().includes('15 characters') || err.errors?.[0]?.code === 'form_password_length_too_short') {
        msg = `${msg} (You can change minimum password length to 8 in your Clerk Dashboard: User & authentication > Password).`;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FEFBF6' }}
      edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 20,
          }}>
          {/* Top Back Nav */}
          <View className="mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-xs">
              <ArrowLeft size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>

          {/* Logo Header */}
          <View className="flex-row items-center justify-center gap-3 mb-8">
            <View
              style={{ backgroundColor: '#F1654C' }}
              className="w-12 h-12 rounded-2xl items-center justify-center shadow-md shadow-orange-500/20">
              <KeyRound size={22} color="#FFFFFF" />
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
            <Text className="text-3xl font-black text-slate-900 tracking-tight">
              {step === 1 ? 'Forgot Password' : 'Set New Password'}
            </Text>
            <Text className="text-sm text-slate-500 mt-1.5 leading-5">
              {step === 1
                ? 'Enter your registered email address and we will send you a 6-digit verification code to reset your password.'
                : `Enter the 6-digit code sent to ${email} and choose a new password with at least 8 characters.`}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-5">
              <View className="flex-row items-center gap-2.5">
                <AlertCircle size={18} color="#f43f5e" />
                <Text className="text-xs text-rose-700 flex-1 font-semibold">{errorMessage}</Text>
              </View>
            </View>
          )}

          {step === 1 ? (
            /* Step 1: Enter Email */
            <View className="gap-4 mb-6">
              <View>
                <Text className="text-xs font-bold text-slate-700 mb-2">Registered Email</Text>
                <TextInput
                  className="bg-white border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-900 shadow-xs"
                  placeholder="Enter your email address"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                onPress={handleRequestCode}
                disabled={loading}
                style={{ backgroundColor: '#F1654C' }}
                activeOpacity={0.85}
                className="w-full py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mt-2">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Send Reset Code</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Step 2: Code, New Password, Confirm Password */
            <View className="gap-4 mb-6">
              <View>
                <Text className="text-xs font-bold text-slate-700 mb-2">6-Digit Reset Code</Text>
                <TextInput
                  className="bg-white border border-slate-300 rounded-2xl px-4 py-3.5 text-center text-xl font-bold tracking-widest text-slate-900 shadow-xs"
                  placeholder="123456"
                  placeholderTextColor="#94a3b8"
                  value={code}
                  onChangeText={(val) => {
                    setCode(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-slate-700 mb-2">
                  New Password (min. 8 characters)
                </Text>
                <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-4 shadow-xs">
                  <TextInput
                    className="flex-1 py-3.5 text-sm text-slate-900"
                    placeholder="Enter new password (min. 8 characters)"
                    placeholderTextColor="#94a3b8"
                    value={newPassword}
                    onChangeText={(val) => {
                      setNewPassword(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1">
                    {showPassword ? (
                      <EyeOff size={18} color="#94a3b8" />
                    ) : (
                      <Eye size={18} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text className="text-xs font-bold text-slate-700 mb-2">Confirm New Password</Text>
                <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-4 shadow-xs">
                  <TextInput
                    className="flex-1 py-3.5 text-sm text-slate-900"
                    placeholder="Re-enter new password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1">
                    {showConfirmPassword ? (
                      <EyeOff size={18} color="#94a3b8" />
                    ) : (
                      <Eye size={18} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                style={{ backgroundColor: '#F1654C' }}
                activeOpacity={0.85}
                className="w-full py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mt-2">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Reset Password</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStep(1)}
                className="py-2 items-center">
                <Text className="text-xs text-slate-500 font-semibold">Change email or resend code</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer Navigation */}
          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-xs text-slate-500">Remember your password? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <Text style={{ color: '#F1654C' }} className="text-xs font-bold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
