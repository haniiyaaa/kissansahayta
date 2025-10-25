import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Sun, Leaf, Building2 } from 'lucide-react-native';
import NavigationBar from './NavigationBar';

export default function Dashboard({navigation}) {
  const [refreshing, setRefreshing] = useState(false);

  const [weatherData] = useState({
    temperature: 28,
    condition: 'Sunny',
    windSpeed: 12,
    rainChance: 10
  });

  const [cropPrices] = useState({
    wheat: 28.50,
    rice: 20.50
  });

  const [schemes] = useState([
    {
      name: 'PM-KISAN SCHEME',
      description: '$6000 Annual support for farmers',
      status: 'Active'
    },
    {
      name: 'Crop Insurance',
      description: 'Protect your crops from natural disaster',
      status: 'Apply Now'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
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
          <Text className="text-4xl font-bold text-black">{weatherData.temperature}°C</Text>
          <Text className="text-base text-black mb-1">{weatherData.condition}</Text>
          <View className="flex-row mt-2">
            <Text className="text-gray-400 mr-5">Wind: {weatherData.windSpeed} km/hr</Text>
            <Text className="text-gray-400">Rain Chances: {weatherData.rainChance}%</Text>
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
            <Text className="text-gray-500">₹{cropPrices.wheat} per quintal</Text>
          </View>
          <View className="mt-2">
            <Text className="font-semibold text-black text-base">Rice</Text>
            <Text className="text-gray-500">₹{cropPrices.rice} per quintal</Text>
          </View>
        </View>

        {/* Government Schemes Card */}
        <View className="bg-white mt-6 mx-4 rounded-2xl p-6 shadow border-2 border-gray-100 mb-6">
          <View className="flex-row items-center mb-2">
            <Building2 size={24} color="#16a34a" />
            <Text className="font-bold text-lg text-black ml-2">Government Schemes</Text>
          </View>
          <View className="mt-2">
            {schemes.map((scheme, i) => (
              <View key={i} className="mb-4">
                <Text className="font-bold text-black text-base">{scheme.name}</Text>
                <Text className="text-gray-500">{scheme.description}</Text>
                <Text className="text-emerald-600 font-bold mt-1">{scheme.status}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <NavigationBar navigation={navigation} />
    </View>
  );
}
