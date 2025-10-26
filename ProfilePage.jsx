
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Animated, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { User, Mail, LogOut, Edit } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationBar from './navigationBar';

const { width } = Dimensions.get('window');

export default function ProfilePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

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
          
          // Start animations after data loads
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start();
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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Button animation
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

            await AsyncStorage.removeItem('token');
            navigation.replace('loginPage');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#d1fae5',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Gradient Circle */}
        <View style={{
          position: 'absolute',
          top: -150,
          right: -150,
          width: 400,
          height: 400,
          borderRadius: 200,
          backgroundColor: '#d1fae5',
          opacity: 0.4,
        }} />

        {/* Profile Header Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 32,
          }}
        >
          {/* Avatar Circle */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#10b981',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: '#10b981',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <User size={60} color="white" />
          </Animated.View>

          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: 8,
          }}>
            {user?.username || 'User'}
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#6b7280',
          }}>
            Farmer & Agriculture Expert
          </Text>
        </Animated.View>

        {/* Info Cards */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 20,
            gap: 16,
          }}
        >
          {/* Username Card */}
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#f3f4f6',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#d1fae5',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <User size={20} color="#10b981" />
              </View>
              <Text style={{
                fontSize: 13,
                color: '#6b7280',
                fontWeight: '500',
              }}>
                USERNAME
              </Text>
            </View>
            <Text style={{
              fontSize: 18,
              color: '#111827',
              fontWeight: '600',
            }}>
              {user?.username || 'Not available'}
            </Text>
          </View>

          {/* Email Card */}
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#f3f4f6',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#fef3c7',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <Mail size={20} color="#f59e0b" />
              </View>
              <Text style={{
                fontSize: 13,
                color: '#6b7280',
                fontWeight: '500',
              }}>
                EMAIL
              </Text>
            </View>
            <Text style={{
              fontSize: 18,
              color: '#111827',
              fontWeight: '600',
            }}>
              {user?.email || 'Not available'}
            </Text>
          </View>

          {/* Account Info */}
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 20,
            marginTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderLeftWidth: 4,
            borderLeftColor: '#10b981',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#dbeafe',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <Edit size={20} color="#3b82f6" />
              </View>
              <Text style={{
                fontSize: 13,
                color: '#6b7280',
                fontWeight: '500',
              }}>
                ACCOUNT STATUS
              </Text>
            </View>
            <Text style={{
              fontSize: 16,
              color: '#10b981',
              fontWeight: '600',
            }}>
              ✓ Active Account
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6b7280',
              marginTop: 4,
            }}>
              Full access to all features
            </Text>
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: buttonScale },
            ],
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 40,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#ef4444',
              borderRadius: 16,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#ef4444',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleLogout}
            activeOpacity={0.9}
          >
            <LogOut size={20} color="#fff" />
            <Text style={{
              color: '#ffffff',
              fontSize: 17,
              fontWeight: '600',
              marginLeft: 10,
              letterSpacing: 0.5,
            }}>
              Logout
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <NavigationBar navigation={navigation} currentRoute="ProfilePage" />
    </SafeAreaView>
  );
}