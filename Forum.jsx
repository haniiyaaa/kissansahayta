
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Animated, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { MessageCircle, ThumbsUp, Send, X, Search } from 'lucide-react-native';
import NavigationBar from './navigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.0.107:5000';
const { width, height } = Dimensions.get('window');

export default function Forum({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [searchText, setSearchText] = useState('');
  const [focused, setFocused] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchQuestions();
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchQuestions = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BACKEND_URL}/api/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setQuestions(data);
  };

  const handleSearch = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(
      `${BACKEND_URL}/api/questions/search?q=${encodeURIComponent(searchText)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (data && data.questions) setQuestions(data.questions);
    else setQuestions([]);
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return Alert.alert('Please enter a question');
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BACKEND_URL}/api/questions`, {
      method: 'POST',
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newQuestion, content: newQuestion }),
    });
    if (res.ok) {
      setModalVisible(false);
      setNewQuestion('');
      fetchQuestions();
    } else {
      const err = await res.json();
      Alert.alert(err.error || 'Error posting question');
    }
  };

  const openQuestion = async (question) => {
    setSelectedQuestion({ ...question, answers: [] });
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BACKEND_URL}/api/questions/${question.id}/answers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAnswers(data);
    setSelectedQuestion({ ...question, answers: data });
  };

  const handlePostAnswer = async () => {
    if (!newAnswer.trim() || !selectedQuestion) return;
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(
      `${BACKEND_URL}/api/questions/${selectedQuestion.id}/answers`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newAnswer }),
      }
    );
    if (res.ok) {
      setNewAnswer('');
      openQuestion(selectedQuestion);
    } else {
      const err = await res.json();
      Alert.alert(err.error || 'Error posting answer');
    }
  };

  const handleUpvote = async (answerId) => {
    const token = await AsyncStorage.getItem('token');
    await fetch(`${BACKEND_URL}/api/questions/answers/${answerId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    openQuestion(selectedQuestion);
  };

  const getTotalUpvotes = (q) =>
    Array.isArray(q.answers)
      ? q.answers.reduce((t, a) => t + (a.likes || 0), 0)
      : 0;

  const getInputStyle = () => {
    const isFocused = focused !== '';
    return {
      backgroundColor: isFocused ? '#ffffff' : '#f8f9fa',
      borderColor: isFocused ? '#10b981' : '#e5e7eb',
      borderWidth: isFocused ? 2 : 1,
    };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            backgroundColor: '#ffffff',
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingTop: 40,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: 4,
          }}>
            Farmer Forum
          </Text>
          <Text style={{ color: '#6b7280', fontSize: 15 }}>
            Ask questions, share knowledge
          </Text>
        </Animated.View>

        {/* Search Bar Card */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            marginHorizontal: 16,
            marginTop: 20,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 16,
            padding: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
                color: '#1f2937',
              }}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search for questions"
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              onFocus={() => setFocused('search')}
              onBlur={() => setFocused('')}
            />
            <TouchableOpacity 
              onPress={handleSearch} 
              style={{
                backgroundColor: '#10b981',
                padding: 10,
                borderRadius: 12,
                marginLeft: 8,
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Search size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Ask Button Card */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#10b981',
                marginHorizontal: 16,
                marginTop: 24,
                marginBottom: 20,
                paddingVertical: 16,
                borderRadius: 16,
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <MessageCircle size={20} color="#fff" />
              <Text style={{
                color: '#ffffff',
                fontSize: 17,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Ask a Question
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Questions List */}
          {questions.length === 0 && (
            <Text style={{
              textAlign: 'center',
              color: '#9ca3af',
              marginTop: 48,
              fontSize: 16,
            }}>
              No questions found.
            </Text>
          )}
          {questions
            .sort((a, b) => getTotalUpvotes(b) - getTotalUpvotes(a))
            .map((q, index) => (
              <Animated.View
                key={q.id}
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, index * 10],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: '#ffffff',
                    marginHorizontal: 16,
                    marginBottom: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={() => openQuestion(q)}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: 12,
                  }}>
                    {q.title || q.question}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    marginBottom: 12,
                  }}>
                    <Text style={{ color: '#6b7280', marginRight: 8 }}>
                      by {q.user?.username || q.author}
                    </Text>
                    <Text style={{ color: '#9ca3af' }}>
                      {q.createdAt?.slice(0,10) || q.date}
                    </Text>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 24,
                    }}>
                      <MessageCircle size={16} color="#6b7280" />
                      <Text style={{
                        marginLeft: 6,
                        color: '#6b7280',
                        fontSize: 14,
                      }}>
                        {Array.isArray(q.answers) ? q.answers.length : q.answersCount} answers
                      </Text>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <ThumbsUp size={16} color="#10b981" />
                      <Text style={{
                        marginLeft: 6,
                        color: '#10b981',
                        fontWeight: '600',
                        fontSize: 14,
                      }}>
                        {getTotalUpvotes(q)} upvotes
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
        </ScrollView>

        {/* Ask Question Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}>
            <View style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              maxHeight: height * 0.6,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#111827',
                }}>
                  Ask a Question
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={{
                  ...getInputStyle(),
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  minHeight: 100,
                  color: '#1f2937',
                  textAlignVertical: 'top',
                }}
                placeholder="Type your question..."
                placeholderTextColor="#9ca3af"
                value={newQuestion}
                onChangeText={setNewQuestion}
                multiline
                onFocus={() => setFocused('question')}
                onBlur={() => setFocused('')}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#10b981',
                  borderRadius: 12,
                  paddingVertical: 16,
                  marginTop: 20,
                  shadowColor: '#10b981',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={handleAskQuestion}
                activeOpacity={0.9}
              >
                <Text style={{
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 17,
                }}>
                  Post Question
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Question Details Modal */}
        <Modal visible={selectedQuestion !== null} animationType="slide" transparent>
          <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}>
            <View style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              height: height * 0.9,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#111827',
                }}>
                  Question Details
                </Text>
                <TouchableOpacity onPress={() => setSelectedQuestion(null)}>
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {selectedQuestion && (
                  <>
                    <View style={{
                      backgroundColor: '#d1fae5',
                      borderWidth: 2,
                      borderColor: '#10b981',
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 20,
                    }}>
                      <Text style={{
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 12,
                        color: '#111827',
                      }}>
                        {selectedQuestion.title || selectedQuestion.question}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: '#374151', marginRight: 12 }}>
                          by {selectedQuestion.user?.username || selectedQuestion.author}
                        </Text>
                        <Text style={{ color: '#9ca3af' }}>
                          {selectedQuestion.createdAt?.slice(0,10) || selectedQuestion.date}
                        </Text>
                      </View>
                    </View>
                    <Text style={{
                      fontSize: 19,
                      fontWeight: 'bold',
                      marginBottom: 16,
                      color: '#111827',
                    }}>
                      Answers ({answers.length})
                    </Text>
                    {answers.length === 0 && (
                      <Text style={{
                        marginBottom: 12,
                        color: '#9ca3af',
                      }}>
                        No answers yet.
                      </Text>
                    )}
                    {answers
                      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                      .map((ans) => (
                        <View key={ans.id} style={{
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 12,
                          padding: 16,
                          marginBottom: 16,
                        }}>
                          <Text style={{
                            fontSize: 16,
                            color: '#1f2937',
                            marginBottom: 8,
                          }}>
                            {ans.content || ans.answer}
                          </Text>
                          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            <Text style={{ color: '#6b7280', marginRight: 12 }}>
                              by {ans.user?.username || ans.author}
                            </Text>
                            <Text style={{ color: '#9ca3af' }}>
                              {ans.createdAt?.slice(0,10) || ans.date}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingVertical: 4,
                            }}
                            onPress={() => handleUpvote(ans.id)}
                            activeOpacity={0.7}
                          >
                            <ThumbsUp size={16} color="#10b981" />
                            <Text style={{
                              marginLeft: 8,
                              color: '#059669',
                              fontWeight: '600',
                            }}>
                              {ans.likes} upvotes
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    <View style={{ marginTop: 20, marginBottom: 40 }}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginBottom: 12,
                        color: '#111827',
                      }}>
                        Your Answer
                      </Text>
                      <TextInput
                        style={{
                          ...getInputStyle(),
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          fontSize: 16,
                          minHeight: 80,
                          color: '#1f2937',
                          textAlignVertical: 'top',
                        }}
                        placeholder="Write your answer..."
                        placeholderTextColor="#9ca3af"
                        value={newAnswer}
                        onChangeText={setNewAnswer}
                        multiline
                        onFocus={() => setFocused('answer')}
                        onBlur={() => setFocused('')}
                      />
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#10b981',
                          paddingVertical: 16,
                          borderRadius: 12,
                          marginTop: 16,
                          shadowColor: '#10b981',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 4,
                        }}
                        onPress={handlePostAnswer}
                        activeOpacity={0.9}
                      >
                        <Send size={18} color="#fff" />
                        <Text style={{
                          color: '#ffffff',
                          fontSize: 17,
                          fontWeight: '600',
                          marginLeft: 8,
                        }}>
                          Post Answer
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>

        <NavigationBar navigation={navigation} currentRoute="Forum" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
