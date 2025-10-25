import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Send, Bot, User } from 'lucide-react-native';
import NavigationBar from './navigationBar';

export default function AIchatbot({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your agricultural AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  // Auto-scroll to bottom when new message added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Function to send message
  const handleSend = async () => {
    if (!inputText.trim()) return;

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
      // TODO: Replace with your AI API call
      // Example:
      // const response = await fetch('YOUR_AI_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: messageToSend })
      // });
      // const data = await response.json();
      // const aiResponse = data.response;

      // For now, just showing how to add bot response
      // Remove this setTimeout and uncomment above code when integrating
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "This is where AI response will appear. Integrate your Gemini AI API here.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <Bot size={28} color="#16a34a" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>AI Assistant</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Ask me anything about farming</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={{
                flexDirection: 'row',
                marginBottom: 16,
                alignItems: 'flex-end',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {/* Bot Avatar */}
              {message.sender === 'bot' && (
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#16a34a' }}>
                  <Bot size={20} color="#16a34a" />
                </View>
              )}

              {/* Message Bubble */}
              <View 
                style={{
                  maxWidth: '75%',
                  padding: 12,
                  borderRadius: 16,
                  backgroundColor: message.sender === 'user' ? '#16a34a' : '#fff',
                  borderWidth: message.sender === 'bot' ? 1 : 0,
                  borderColor: '#e5e7eb',
                  borderBottomRightRadius: message.sender === 'user' ? 4 : 16,
                  borderBottomLeftRadius: message.sender === 'bot' ? 4 : 16
                }}
              >
                <Text style={{ fontSize: 15, lineHeight: 22, color: message.sender === 'user' ? '#fff' : '#000' }}>
                  {message.text}
                </Text>
                <Text style={{ fontSize: 11, marginTop: 4, color: message.sender === 'user' ? '#dcfce7' : '#9ca3af', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                  {message.timestamp}
                </Text>
              </View>

              {/* User Avatar */}
              {message.sender === 'user' && (
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#16a34a', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                  <User size={20} color="#fff" />
                </View>
              )}
            </View>
          ))}

          {/* Loading indicator */}
          {loading && (
            <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#16a34a' }}>
                <Bot size={20} color="#16a34a" />
              </View>
              <View style={{ padding: 12, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' }}>
                <Text style={{ fontSize: 15, color: '#000' }}>Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#fff', padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', marginBottom: 60 }}>
          <TextInput
            style={{ flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100, marginRight: 8 }}
            placeholder="Ask about crops, weather, prices..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#16a34a', justifyContent: 'center', alignItems: 'center', opacity: !inputText.trim() || loading ? 0.5 : 1 }}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <NavigationBar navigation={navigation} />
    </View>
  );
}
