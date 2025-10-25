import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, MessageSquare, Users, User } from 'lucide-react-native';

export default function NavigationBar({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Home Icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.iconButton}
      >
        <Home size={28} color="#16a34a" />
      </TouchableOpacity>

      {/* AI Chatbot Icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('AIchatbot')}
        style={styles.iconButton}
      >
        <MessageSquare size={28} color="#16a34a" />
      </TouchableOpacity>

      {/* Forum Icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Forum')}
        style={styles.iconButton}
      >
        <Users size={28} color="#16a34a" />
      </TouchableOpacity>

      {/* Profile Icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('ProfilePage')}
        style={styles.iconButton}
      >
        <User size={28} color="#16a34a" />
      </TouchableOpacity>
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
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
