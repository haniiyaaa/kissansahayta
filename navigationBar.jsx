
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Home, MessageSquare, Users, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function NavigationBar({ navigation, currentRoute }) {
  // Create scale animations for each button
  const homeScale = useRef(new Animated.Value(1)).current;
  const chatScale = useRef(new Animated.Value(1)).current;
  const forumScale = useRef(new Animated.Value(1)).current;
  const profileScale = useRef(new Animated.Value(1)).current;

  const animatePress = (scaleAnim, targetRoute) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getIconColor = (route) => {
    return currentRoute === route ? '#10b981' : '#9ca3af';
  };

  const getIconSize = (route) => {
    return currentRoute === route ? 26 : 24;
  };

  return (
    <View style={styles.container}>
      {/* Home Icon */}
      <Animated.View style={{ transform: [{ scale: homeScale }] }}>
        <TouchableOpacity 
          onPress={() => {
            animatePress(homeScale, 'Dashboard');
            navigation.navigate('Dashboard');
          }}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Home 
            size={getIconSize('Dashboard')} 
            color={getIconColor('Dashboard')} 
          />
          {currentRoute === 'Dashboard' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </Animated.View>

      {/* AI Chatbot Icon */}
      <Animated.View style={{ transform: [{ scale: chatScale }] }}>
        <TouchableOpacity 
          onPress={() => {
            animatePress(chatScale, 'AIchatbot');
            navigation.navigate('AIchatbot');
          }}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MessageSquare 
            size={getIconSize('AIchatbot')} 
            color={getIconColor('AIchatbot')} 
          />
          {currentRoute === 'AIchatbot' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </Animated.View>

      {/* Forum Icon */}
      <Animated.View style={{ transform: [{ scale: forumScale }] }}>
        <TouchableOpacity 
          onPress={() => {
            animatePress(forumScale, 'Forum');
            navigation.navigate('Forum');
          }}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Users 
            size={getIconSize('Forum')} 
            color={getIconColor('Forum')} 
          />
          {currentRoute === 'Forum' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </Animated.View>

      {/* Profile Icon */}
      <Animated.View style={{ transform: [{ scale: profileScale }] }}>
        <TouchableOpacity 
          onPress={() => {
            animatePress(profileScale, 'ProfilePage');
            navigation.navigate('ProfilePage');
          }}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <User 
            size={getIconSize('ProfilePage')} 
            color={getIconColor('ProfilePage')} 
          />
          {currentRoute === 'ProfilePage' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  iconButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 3,
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
});
