import React, { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { Sprout } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Signup({ navigation }) {
  // State to store form inputs
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Start animations on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Function to handle signup
  const handleSignup = async () => {
    // Basic validation
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      // Call your backend API
      const response = await fetch('http://192.168.0.107:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          pass: password, 
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName) => {
    const isFocused = focused === fieldName;
    return {
      backgroundColor: isFocused ? '#ffffff' : '#f8f9fa',
      borderColor: isFocused ? '#10b981' : '#e5e7eb',
      borderWidth: isFocused ? 2 : 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: '#1f2937',
      shadowColor: isFocused ? '#10b981' : '#000000',
      shadowOffset: { width: 0, height: isFocused ? 2 : 0 },
      shadowOpacity: isFocused ? 0.1 : 0,
      shadowRadius: isFocused ? 4 : 0,
      elevation: isFocused ? 2 : 0,
    };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 24 }}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Gradient Background Circles */}
          <View style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: '#d1fae5',
            opacity: 0.4,
          }} />
          <View style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#fef3c7',
            opacity: 0.3,
          }} />

          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* App Branding */}
            <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 32 }}>
              <View style={{
                backgroundColor: '#10b981',
                padding: 20,
                borderRadius: 100,
                marginBottom: 16,
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}>
                <Sprout size={64} color="white" />
              </View>
              <Text style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: 4,
              }}>
                Kissan Sahayta
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 16 }}>
                Your Agricultural Companion
              </Text>
            </View>

            {/* Sign Up Section Title */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: 8,
              }}>
                Create Account
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 16 }}>
                Sign up to get started
              </Text>
            </View>
          </Animated.View>

          {/* Form Container */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View style={{ gap: 20 }}>
              {/* Email Input */}
              <View>
                <Text style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: 8,
                  fontSize: 15,
                }}>
                  Email
                </Text>
                <TextInput
                  style={getInputStyle('email')}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                />
              </View>

              {/* Username Input */}
              <View>
                <Text style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: 8,
                  fontSize: 15,
                }}>
                  Username
                </Text>
                <TextInput
                  style={getInputStyle('username')}
                  placeholder="Choose a username"
                  placeholderTextColor="#9ca3af"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                />
              </View>

              {/* Password Input */}
              <View>
                <Text style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: 8,
                  fontSize: 15,
                }}>
                  Password
                </Text>
                <TextInput
                  style={getInputStyle('password')}
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text style={{
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: 8,
                  fontSize: 15,
                }}>
                  Confirm Password
                </Text>
                <TextInput
                  style={getInputStyle('confirmPassword')}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused('')}
                />
              </View>

              {/* Sign Up Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#10b981',
                    borderRadius: 12,
                    paddingVertical: 16,
                    marginTop: 8,
                    shadowColor: '#10b981',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                    opacity: loading ? 0.7 : 1,
                  }}
                  onPress={handleSignup}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <Text style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 18,
                    letterSpacing: 0.5,
                  }}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Already have account link */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
                <Text style={{ color: '#6b7280', fontSize: 16 }}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('loginPage')} activeOpacity={0.7}>
                  <Text style={{ color: '#10b981', fontSize: 16, fontWeight: '600' }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}