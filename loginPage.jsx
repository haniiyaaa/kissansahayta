import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Sprout } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function loginPage({ navigation }) {
  // State for login inputs
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle login
  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('http://YOUR_BACKEND_URL/api/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await response.json();

    if (response.ok && data.token) {
      await AsyncStorage.setItem('token', data.token);
      Alert.alert('Success', 'Logged in!');
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Error', data.error || 'Login failed!');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Network error');
  } finally {
    setLoading(false);
  }
};



  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* App Branding - Same as Signup */}
          <View className="items-center mt-16 mb-8">
            <View className="bg-green-600 p-6 rounded-full mb-4">
              <Sprout size={64} color="white" />
            </View>
            <Text className="text-4xl font-bold text-gray-800">
              Kissan Sahayta
            </Text>
          </View>

          {/* Login Section Title */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800">Login</Text>
            <Text className="text-gray-500 mt-1">Login to your account!!</Text>
          </View>

          {/* Form Container */}
          <View className="space-y-4">
            {/* Email/Username Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email or Username</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your email or username"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>

            {/* Password Input */}
            <View className="mt-4">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-green-600 rounded-lg py-4 mt-6"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Don't have account link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 text-lg">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text className="text-emerald-600  text-lg font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
