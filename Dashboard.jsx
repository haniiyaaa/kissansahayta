import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Leaf } from 'lucide-react-native';
import NavigationBar from './navigationBar';
import { fetchWeatherByCoords, fetchMandiPrices } from './api';

export default function Dashboard({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cropPrices, setCropPrices] = useState(null);

  const defaultCoords = { latitude: 19.0760, longitude: 72.8777 }; // Mumbai fallback

  // Get user location safely
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Using default location (Mumbai)');
        return defaultCoords;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      return location.coords;
    } catch (err) {
      console.log('Location error:', err);
      Alert.alert('Location Error', 'Using default location (Mumbai)');
      return defaultCoords;
    }
  };

  // Fetch weather and crop prices
  const fetchData = async () => {
    try {
      const coords = await getUserLocation();
      const weather = await fetchWeatherByCoords(coords.latitude, coords.longitude);
      setWeatherData(weather);

      const mandiData = await fetchMandiPrices('Maharashtra');
      if (mandiData?.mandi_data) {
        const wheat = mandiData.mandi_data.find((c) => c.commodity === 'Wheat')?.modal_price || 0;
        const rice = mandiData.mandi_data.find((c) => c.commodity === 'Rice')?.modal_price || 0;
        setCropPrices({ wheat, rice });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#16a34a']}
            tintColor="#16a34a"
          />
        }
      >
        {/* Weather Card */}
        <View className="bg-white mt-4 mx-4 rounded-2xl p-6 shadow border-2 border-gray-100">
          <Text className="text-gray-400 text-sm mb-1">Weather Today</Text>
          <Text className="text-4xl font-bold text-black">
            {weatherData ? weatherData.temperature : '--'}°C
          </Text>
          <Text className="text-base text-black mb-1">{weatherData?.condition || '--'}</Text>
          <View className="flex-row mt-2">
            <Text className="text-gray-400 mr-5">Wind: {weatherData?.wind_speed || '--'} km/hr</Text>
            <Text className="text-gray-400">Humidity: {weatherData?.humidity || '--'}%</Text>
          </View>
        </View>

        {/* Crop Prices Card */}
        <View className="bg-white mt-6 mx-4 rounded-2xl p-6 shadow border-2 border-gray-100">
          <View className="flex-row items-center mb-2">
            <Leaf size={24} color="#16a34a" />
            <Text className="font-bold text-lg text-black ml-2">Crop Prices</Text>
          </View>
          <View className="mt-2">
            <Text className="font-semibold text-black text-base">Wheat</Text>
            <Text className="text-gray-500">₹{cropPrices?.wheat || '--'} per quintal</Text>
          </View>
          <View className="mt-2">
            <Text className="font-semibold text-black text-base">Rice</Text>
            <Text className="text-gray-500">₹{cropPrices?.rice || '--'} per quintal</Text>
          </View>
        </View>
      </ScrollView>
      <NavigationBar navigation={navigation} />
    </View>
  );
}
