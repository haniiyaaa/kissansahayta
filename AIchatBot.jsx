
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import NavigationBar from './navigationBar';

const { width } = Dimensions.get('window');

export default function AIchatbot({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your agricultural AI assistant. How can I help you today? Ask me about crops, weather, farming techniques, or crop prices!",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  // Auto-scroll to bottom when new message added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Function to send message
  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setLoading(true);

    try {
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I'm your AI agricultural assistant! I can help you with:\n\n🌾 Crop information\n🌦️ Weather updates\n💰 Market prices\n📚 Farming techniques\n🌱 Plant care advice\n\nFeel free to ask me anything about agriculture!",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I couldn't process your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#d1fae5',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#10b981',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Bot size={28} color="#10b981" />
        </View>
        <View style={{ marginLeft: 16, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#111827',
            }}>
              AI Assistant
            </Text>
            <View style={{
              marginLeft: 8,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#10b981',
            }} />
          </View>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
            marginTop: 2,
          }}>
            Your Agricultural Expert
          </Text>
        </View>
      </View>

      {/* Background Decoration */}
      <View style={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#d1fae5',
        opacity: 0.3,
      }} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        >
          {messages.map((message, index) => (
            <View 
              key={message.id} 
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignItems: 'flex-end',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Bot Avatar */}
              {message.sender === 'bot' && (
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f0fdf4',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                  borderWidth: 2,
                  borderColor: '#10b981',
                  shadowColor: '#10b981',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                  <Bot size={20} color="#10b981" />
                </View>
              )}

              {/* Message Bubble */}
              <View 
                style={{
                  maxWidth: '75%',
                  padding: 14,
                  borderRadius: 20,
                  backgroundColor: message.sender === 'user' ? '#10b981' : '#ffffff',
                  borderWidth: message.sender === 'bot' ? 1 : 0,
                  borderColor: message.sender === 'bot' ? '#e5e7eb' : 'transparent',
                  borderBottomRightRadius: message.sender === 'user' ? 6 : 20,
                  borderBottomLeftRadius: message.sender === 'bot' ? 6 : 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: message.sender === 'user' ? 0.15 : 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: message.sender === 'user' ? '#ffffff' : '#1f2937',
                }}>
                  {message.text}
                </Text>
                <Text style={{
                  fontSize: 11,
                  marginTop: 6,
                  color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                  textAlign: message.sender === 'user' ? 'right' : 'left',
                }}>
                  {message.timestamp}
                </Text>
              </View>

              {/* User Avatar */}
              {message.sender === 'user' && (
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#10b981',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 12,
                  shadowColor: '#10b981',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}>
                  <User size={20} color="#fff" />
                </View>
              )}
            </View>
          ))}

          {/* Loading indicator */}
          {loading && (
            <View style={{
              flexDirection: 'row',
              marginBottom: 20,
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#f0fdf4',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                borderWidth: 2,
                borderColor: '#10b981',
              }}>
                <Bot size={20} color="#10b981" />
              </View>
              <View style={{
                padding: 14,
                borderRadius: 20,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#10b981',
                    marginRight: 4,
                  }} />
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#10b981',
                    marginRight: 4,
                    opacity: 0.6,
                  }} />
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#10b981',
                    opacity: 0.3,
                  }} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#f9fafb',
              borderWidth: 1,
              borderColor: inputText.trim() ? '#10b981' : '#e5e7eb',
              borderRadius: 24,
              paddingHorizontal: 18,
              paddingVertical: 12,
              fontSize: 16,
              maxHeight: 100,
              marginRight: 12,
              color: '#1f2937',
            }}
            placeholder="Ask about crops, weather, prices..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity 
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: inputText.trim() && !loading ? '#10b981' : '#d1d5db',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: inputText.trim() ? '#10b981' : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: inputText.trim() ? 4 : 0,
            }}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
            activeOpacity={0.8}
          >
            <Send size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <NavigationBar navigation={navigation} currentRoute="AIchatbot" />
    </SafeAreaView>
  );
}