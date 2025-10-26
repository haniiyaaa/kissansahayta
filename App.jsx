import "./global.css"
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";  
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import signup from './signup'; 
import "./global.css";
import languagepage from "./languagepage";  
import ProfilePage from "./ProfilePage";
import Dashboard from './Dashboard';
import loginPage from "./loginPage";
import Forum from "./Forum";
import AIchatbot from "./AIchatBot";


 
const Stack = createNativeStackNavigator(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="signup"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="signup" component={signup} />
        <Stack.Screen name="loginPage" component={loginPage} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="languagepage" component={languagepage} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
        <Stack.Screen name="Forum" component={Forum} />
        <Stack.Screen name="AIchatbot" component={AIchatbot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

