import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfilePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('login');
          return;
        }

        const res = await fetch('http://192.168.0.107:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch profile');
          navigation.replace('login');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Network error');
        navigation.replace('login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('loginPage');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-green-50 justify-center items-center p-6">
      <Text className="text-3xl font-bold mb-4">Username: {user?.username}</Text>
      <Text className="text-2xl mb-8">Email: {user?.email}</Text>

      <TouchableOpacity
        className="bg-red-600 px-6 py-3 rounded-full"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
