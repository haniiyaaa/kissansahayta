import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sprout } from 'lucide-react-native';

export default function languagepage() {
  const handleLanguageSelect = (language) => {
    console.log(`Selected language: ${language}`);

  };

  const languages = [
    { name: 'English' },
    { name: 'हिन्दी' },
    { name: 'বাংলা' },
    { name: 'मराठी' },
    { name: 'ગુજરાતી' },
    { name: 'తెలుగు' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <View className="flex-1 px-4 py-8">
        <View className="items-center mb-8">
          <View className="bg-green-600 rounded-full p-6 mb-4">
            <Sprout size={48} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            Select Language
          </Text>
          <Text className="text-sm text-gray-600">
            Choose your preferred language
          </Text>
        </View>

      
        <View className="flex-row flex-wrap gap-4">
          {languages.map((lang, index) => (
            <TouchableOpacity
              key={index}
              className="basis-[calc(50%-8px)] bg-white rounded-xl p-4 border border-gray-100 active:bg-green-50"
              activeOpacity={0.7}
              onPress={() => handleLanguageSelect(lang.name)}
            >
              <View className="items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  {lang.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
