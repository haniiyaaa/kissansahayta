import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Sprout, Globe } from 'lucide-react-native';

export default function Signup() {
  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <View className="flex-1 px-6 pt-20 items-center">
        
        {/* Logo and App Name */}
        <View className="items-center mb-20">
          <View className="bg-green-600 w-24 h-24 rounded-full items-center justify-center mb-6">
            <Sprout size={48} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Kissan Sahayata
          </Text>
        </View>

        {/* Google Sign Up Button */}
        <TouchableOpacity className="bg-white flex-row items-center justify-center py-4 px-6 rounded-xl shadow-sm w-full max-w-sm">
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
            className="w-5 h-5 mr-3" 
          />
          <Text className="text-gray-700 font-semibold text-base">
            Continue With Google
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}