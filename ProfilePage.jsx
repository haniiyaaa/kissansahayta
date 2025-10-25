
import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Home, MessageSquare, User, Camera } from 'lucide-react-native';
import NavigationBar from './navigationBar';

export default function ProfilePage({navigation}) {

  return (
    <View className="flex-1 bg-green-50">
      <ScrollView className="flex-1">
        <View className="items-center pt-8 px-4">
          <View className="relative">
            <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden">
              <User size={64} className="text-gray-400" />
            </View>
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full"
              onPress={() => {}}
            >
              <Camera size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-gray-500 mb-2 mt-2 text-lg">Edit Image</Text> 
        </View>

        <View className="px-4 py-6 space-y-10"> 
          <View>
            <Text className="text-gray-500 mb-3 text-2xl font-medium">First Name</Text> 
            <TextInput
              className="w-full bg-white px-4 py-4 rounded-lg border border-gray-200 text-lg" 
              placeholder="Enter first name"
              defaultValue="Name"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-3 text-2xl font-medium">Last Name</Text> 
            <TextInput
              className="w-full bg-white px-4 py-4 rounded-lg border border-gray-200 text-lg" 
              placeholder="Enter last name"
              defaultValue="Last Name"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-3 text-2xl font-medium">Phone Number</Text> 
            <TextInput
              className="w-full bg-white px-4 py-4 rounded-lg border border-gray-200 text-lg" 
              placeholder="Enter phone number"
              defaultValue="Phone Number"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-3 text-2xl font-medium">Email-Id</Text> 
            <TextInput
              className="w-full bg-white px-4 py-4 rounded-lg border border-gray-200 text-lg"
              placeholder="Enter email address"
              defaultValue="Email-Id"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </ScrollView>

      
  <NavigationBar navigation={navigation} />

  </View>
  );
}