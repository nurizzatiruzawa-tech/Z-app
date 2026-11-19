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
import { useRouter } from 'expo-router';
import { useSignUp } from '@/context/clerk-adapter';
import * as WebBrowser from 'expo-web-browser';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';
import { useAppAuth } from '@/context/auth-context';

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignUpScreen() {
  const router = useRouter();
  const { isClerkConfigured, signInAsGuest, setUserProfile } = useAppAuth();
  const { signUp, isLoaded } = useSignUp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // OTP Verification
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    if (!isClerkConfigured || !isLoaded || !signUp) {
      await setUserProfile({
        name: name.trim(),
        email: email.trim(),
        isLoggedIn: false,
      });
      setLoading(false);
      Alert.alert(
        'Account Created',
        'Account created successfully. Please sign in to continue.',
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
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name.trim();
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

      await setUserProfile({
        name: name.trim(),
        email: email.trim(),
        isLoggedIn: false,
      });

      await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      const errCode = err.errors?.[0]?.code;
      let msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Sign up failed.';
      
      if (errCode === 'form_identifier_exists' || msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('taken')) {
        Alert.alert(
          'Account Already Exists',
          'An account with this email already exists. Please sign in.',
          [
            {
              text: 'Go to Sign In',
              onPress: () => {
                router.replace({
                  pathname: '/(auth)/sign-in',
                  params: { email: email.trim() },
                });
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setErrorMessage('This email is already registered. Please Sign In below.');
      } else {
        if (msg.toLowerCase().includes('15 characters') || errCode === 'form_password_length_too_short') {
          msg = `${msg} (You can change minimum password length to 8 in your Clerk Dashboard: User & authentication > Password).`;
        }
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const completeSignUp = await signUp!.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (completeSignUp.status === 'complete') {
        Alert.alert(
          'Account Created!',
          'Your account has been verified successfully. Please sign in with your email and password.',
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
        return;
      } else {
        setErrorMessage('Verification incomplete. Please check the code.');
      }
    } catch (err: any) {
      const errCode = err.errors?.[0]?.code;
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Code verification failed.';

      // Handle already verified state
      if (
        errCode === 'verification_already_verified' ||
        msg.toLowerCase().includes('already been verified') ||
        msg.toLowerCase().includes('already verified')
      ) {
        Alert.alert(
          'Email Already Verified',
          'Your account is already verified! Please sign in with your email and password.',
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
        return;
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
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
            <Text className="text-3xl font-black text-slate-900 tracking-tight">
              {pendingVerification ? 'Verify Email' : 'Create an account'}
            </Text>
            <Text className="text-sm text-slate-500 mt-1.5">
              {pendingVerification
                ? `Enter the 6-digit code sent to ${email}`
                : 'Join Recurly to monitor and manage all your recurring subscriptions'}
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-5">
              <View className="flex-row items-center gap-2.5">
                <AlertCircle size={18} color="#f43f5e" />
                <Text className="text-xs text-rose-700 flex-1 font-semibold">{errorMessage}</Text>
              </View>
              {errorMessage.toLowerCase().includes('already') && (
                <TouchableOpacity
                  onPress={() => router.replace('/(auth)/sign-in')}
                  style={{ backgroundColor: '#F1654C' }}
                  className="mt-3 py-2.5 px-4 rounded-xl items-center shadow-xs">
                  <Text className="text-white text-xs font-black">Go to Sign In</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {!pendingVerification ? (
            <>
              {/* Form */}
              <View className="gap-4 mb-6">
                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-2">Full Name</Text>
                  <TextInput
                    className="bg-white border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-900 shadow-xs"
                    placeholder="Enter your name"
                    placeholderTextColor="#94a3b8"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

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
                  <Text className="text-xs font-bold text-slate-700 mb-2">Password (min. 8 characters)</Text>
                  <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-4 shadow-xs">
                    <TextInput
                      className="flex-1 py-3.5 text-sm text-slate-900"
                      placeholder="Create a password (min. 8 characters)"
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

                <View>
                  <Text className="text-xs font-bold text-slate-700 mb-2">Confirm Password</Text>
                  <View className="flex-row items-center bg-white border border-slate-300 rounded-2xl px-4 shadow-xs">
                    <TextInput
                      className="flex-1 py-3.5 text-sm text-slate-900"
                      placeholder="Re-enter your password"
                      placeholderTextColor="#94a3b8"
                      value={confirmPassword}
                      onChangeText={(val) => {
                        setConfirmPassword(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-1">
                      {showConfirmPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSignUp}
                disabled={loading}
                style={{ backgroundColor: '#F1654C' }}
                activeOpacity={0.85}
                className="w-full py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Create Account</Text>
                )}
              </TouchableOpacity>

              {/* Demo Guest Option */}
              <TouchableOpacity
                onPress={() => {
                  signInAsGuest();
                  router.replace('/(tabs)');
                }}
                className="flex-row items-center justify-center gap-2 py-3 rounded-full border border-slate-300 bg-white shadow-xs mb-6">
                <Sparkles size={16} color="#F1654C" />
                <Text className="text-xs font-bold text-slate-700">Continue as Demo Guest</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Verification Form */}
              <View className="mb-6">
                <Text className="text-xs font-bold text-slate-700 mb-2">Verification Code</Text>
                <TextInput
                  className="bg-white border border-slate-300 rounded-2xl px-4 py-4 text-center text-2xl font-bold tracking-widest text-slate-900 shadow-xs"
                  placeholder="123456"
                  placeholderTextColor="#94a3b8"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={loading}
                style={{ backgroundColor: '#F1654C' }}
                activeOpacity={0.85}
                className="w-full py-4 rounded-full items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Verify & Continue</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Footer Navigation */}
          <View className="flex-row items-center justify-center">
            <Text className="text-xs text-slate-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
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
