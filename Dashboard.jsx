

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, Platform, Animated, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Leaf, Cloud, Wind, Droplets, Sun, TrendingUp, MapPin, Calendar, DollarSign, Sprout } from 'lucide-react-native';
import NavigationBar from './navigationBar';

const { width } = Dimensions.get('window');
const BACKEND_URL = 'http://192.168.0.107:5000';

export default function Dashboard({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cropPrices, setCropPrices] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultCoords = { latitude: 19.0760, longitude: 72.8777 };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const weatherCardScale = useRef(new Animated.Value(0.9)).current;
  const cropCardSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (weatherData || cropPrices) {
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
        Animated.spring(weatherCardScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(cropCardSlide, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [weatherData, cropPrices]);

  const getLocationName = async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return address.city || address.region || address.country || 'Unknown Location';
      }
    } catch (error) {
      console.log('Geocoding error:', error);
    }
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission', 'Using Mumbai as default location.', [{ text: 'OK' }]);
        const coords = defaultCoords;
        const locName = await getLocationName(coords.latitude, coords.longitude);
        setLocationName(locName);
        return coords;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 5000,
      });
      
      const coords = location.coords;
      console.log('📍 Location:', coords.latitude, coords.longitude);
      const locName = await getLocationName(coords.latitude, coords.longitude);
      setLocationName(locName);
      return coords;
    } catch (err) {
      console.log('Location error:', err);
      const coords = defaultCoords;
      const locName = await getLocationName(coords.latitude, coords.longitude);
      setLocationName(locName);
      return coords;
    }
  };

  // Fetch weather data directly
  const fetchWeatherData = async (lat, lon) => {
    try {
      console.log(`🌤️ Fetching weather from: ${BACKEND_URL}/api/weather?lat=${lat}&lon=${lon}`);
      const res = await fetch(`${BACKEND_URL}/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      console.log('✅ Weather Data Received:', data);
      return data;
    } catch (err) {
      console.error('❌ Weather fetch error:', err);
      // Return fallback mock data for testing
      return {
        temperature: 28,
        condition: 'Sunny',
        wind_speed: 15,
        humidity: 65
      };
    }
  };

  // Fetch crop prices directly
  const fetchMandiData = async () => {
    try {
      console.log(`💰 Fetching prices from: ${BACKEND_URL}/api/mandi?state=Maharashtra`);
      const res = await fetch(`${BACKEND_URL}/api/mandi?state=Maharashtra&commodity=`);
      const data = await res.json();
      console.log('✅ Mandi Data Received:', data);
      return data;
    } catch (err) {
      console.error('❌ Mandi fetch error:', err);
      return null;
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coords = await getUserLocation();
      
      const weather = await fetchWeatherData(coords.latitude, coords.longitude);
      console.log('📊 Setting weather data:', weather);
      setWeatherData(weather);

      const mandiData = await fetchMandiData();
      if (mandiData?.mandi_data) {
        const wheat = mandiData.mandi_data.find((c) => c.commodity === 'Wheat')?.modal_price || 0;
        const rice = mandiData.mandi_data.find((c) => c.commodity === 'Rice')?.modal_price || 0;
        setCropPrices({ wheat, rice });
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    weatherCardScale.setValue(0.9);
    cropCardSlide.setValue(50);
    await fetchData();
    setRefreshing(false);
  };

  const getWeatherIcon = () => {
    if (!weatherData?.condition) return <Sun size={40} color="#fbbf24" />;
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('cloud')) return <Cloud size={40} color="#6b7280" />;
    if (condition.includes('rain')) return <Droplets size={40} color="#3b82f6" />;
    return <Sun size={40} color="#fbbf24" />;
  };

  const getTemperature = () => {
    if (weatherData) {
      const temp = weatherData.temperature || weatherData.temp || weatherData.main?.temp;
      if (temp && !isNaN(temp)) return Math.round(Number(temp));
    }
    return null;
  };

  const getWindSpeed = () => {
    if (weatherData) {
      const wind = weatherData.wind_speed || weatherData.wind?.speed || weatherData.speed;
      if (wind && !isNaN(wind)) return Number(wind).toFixed(1);
    }
    return null;
  };

  const getHumidity = () => {
    if (weatherData) {
      const humidity = weatherData.humidity || weatherData.main?.humidity;
      if (humidity && !isNaN(humidity)) return Number(humidity);
    }
    return null;
  };

  const getCondition = () => {
    if (weatherData) {
      return weatherData.condition || weatherData.description || weatherData.weather?.[0]?.description || 'Clear';
    }
    return '--';
  };

  if (isLoading && !weatherData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
        }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#d1fae5',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
          <Text style={{
            marginTop: 20,
            fontSize: 16,
            color: '#6b7280',
            fontWeight: '500',
          }}>
            Detecting your location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flex: 1 }}>
        <View style={{
          position: 'absolute',
          top: -200,
          left: -200,
          width: 500,
          height: 500,
          borderRadius: 250,
          backgroundColor: '#d1fae5',
          opacity: 0.3,
        }} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#10b981']}
              tintColor="#10b981"
              progressViewOffset={20}
            />
          }
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: 20,
              marginBottom: 24,
            }}
          >
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 8,
            }}>
              Dashboard
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
            }}>
              Your Agriculture Command Center
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: weatherCardScale }],
              backgroundColor: '#ffffff',
              marginHorizontal: 16,
              marginBottom: 20,
              borderRadius: 20,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#f3f4f6',
              overflow: 'hidden',
            }}
          >
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: '#dbeafe',
              opacity: 0.4,
            }} />

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f0fdf4',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 16,
            }}>
              <MapPin size={14} color="#10b981" />
              <Text style={{
                marginLeft: 6,
                fontSize: 13,
                fontWeight: '600',
                color: '#059669',
              }}>
                {locationName || 'Detecting...'}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: '#6b7280',
                  fontSize: 14,
                  fontWeight: '500',
                  marginBottom: 8,
                }}>
                  Weather Today
                </Text>
                <Text style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: 4,
                }}>
                  {getTemperature() !== null ? `${getTemperature()}°` : '--'}
                </Text>
                <Text style={{
                  fontSize: 18,
                  color: '#374151',
                  fontWeight: '500',
                }}>
                  {getCondition()}
                </Text>
              </View>

              <View style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#f0f9ff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {getWeatherIcon()}
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#f3f4f6',
              gap: 24,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#dbeafe',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                  <Wind size={18} color="#3b82f6" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 12,
                    color: '#6b7280',
                    marginBottom: 2,
                  }}>
                    Wind Speed
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#111827',
                  }}>
                    {getWindSpeed() !== null ? `${getWindSpeed()} km/hr` : '--'}
                  </Text>
                </View>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#fef3c7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                  <Droplets size={18} color="#f59e0b" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 12,
                    color: '#6b7280',
                    marginBottom: 2,
                  }}>
                    Humidity
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#111827',
                  }}>
                    {getHumidity() !== null ? `${getHumidity()}%` : '--'}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: cropCardSlide }],
              backgroundColor: '#ffffff',
              marginHorizontal: 16,
              marginBottom: 20,
              borderRadius: 20,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
              borderWidth: 1,
              borderColor: '#f3f4f6',
              overflow: 'hidden',
            }}
          >
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: '#d1fae5',
              opacity: 0.4,
            }} />

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#d1fae5',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
                <DollarSign size={24} color="#10b981" />
              </View>
              <View>
                <Text style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#111827',
                }}>
                  Crop Prices
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginTop: 2,
                }}>
                  Current Market Rates
                </Text>
              </View>
            </View>

            {cropPrices?.wheat ? (
              <View style={{
                backgroundColor: '#fef3c7',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <View>
                    <Text style={{
                      fontSize: 13,
                      color: '#92400e',
                      fontWeight: '600',
                      marginBottom: 4,
                    }}>
                      WHEAT
                    </Text>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#78350f',
                    }}>
                      ₹{cropPrices.wheat}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#a16207',
                    }}>
                      per quintal
                    </Text>
                  </View>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#fde68a',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TrendingUp size={24} color="#78350f" />
                  </View>
                </View>
              </View>
            ) : null}

            {cropPrices?.rice ? (
              <View style={{
                backgroundColor: '#ddd6fe',
                borderRadius: 12,
                padding: 16,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <View>
                    <Text style={{
                      fontSize: 13,
                      color: '#5b21b6',
                      fontWeight: '600',
                      marginBottom: 4,
                    }}>
                      RICE
                    </Text>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#6b21a8',
                    }}>
                      ₹{cropPrices.rice}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#7c3aed',
                    }}>
                      per quintal
                    </Text>
                  </View>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#c4b5fd',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TrendingUp size={24} color="#6b21a8" />
                  </View>
                </View>
              </View>
            ) : null}

            {!cropPrices?.wheat && !cropPrices?.rice && (
              <Text style={{
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: 15,
                paddingVertical: 20,
              }}>
                Crop prices will appear here
              </Text>
            )}
          </Animated.View>
        </ScrollView>

        <NavigationBar navigation={navigation} currentRoute="Dashboard" />
      </View>
    </SafeAreaView>
  );
}