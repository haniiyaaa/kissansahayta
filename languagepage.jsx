import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sprout } from 'lucide-react-native';

export default function languagepage({navigation}) {
  const languages = [
    { name: 'English' },
    { name: 'हिन्दी' },
    { name: 'বাংলা' },
    { name: 'मराठी' },
    { name: 'ગુજરાતી' },
    { name: 'తెలుగు' },
  ];

  const handleLanguageSelect = (language) => {
  navigation.navigate('Dashboard', { language: language }); 
};


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

        <View className="flex-1 items-center justify-center bg-white">
<View className="rounded-2xl bg-gray-200/70 p-6 w-[350px] h-[330px] flex-row flex-wrap justify-center items-center gap-4">
          {languages.map((language) => (
            <TouchableOpacity
              key={language.name}
              className="bg-green-200 rounded-lg p-2 w-[35%] h-[70px] justify-center items-center pt-3"
              onPress={() => handleLanguageSelect(language.name)}
            >
              <Text className="text-lg text-gray-800">{language.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>
        </View>

    </SafeAreaView>
  );
}
