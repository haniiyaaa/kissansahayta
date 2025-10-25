import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MessageCircle, ThumbsUp, Send, X, Search } from 'lucide-react-native';
import NavigationBar from './NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://YOUR_BACKEND_URL'; // <--- update this to your server URL

export default function Forum({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [searchText, setSearchText] = useState('');

  // Fetch all questions on mount
  useEffect(() => {
    fetchQuestions();
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

  // Open modal and fetch answers for the selected question
  const openQuestion = async (question) => {
    setSelectedQuestion({ ...question, answers: [] }); // temp state for fast UI feel
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
      // Refresh answers
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
    openQuestion(selectedQuestion); // reload answers with updated likes
  };

  const getTotalUpvotes = (q) =>
    Array.isArray(q.answers)
      ? q.answers.reduce((t, a) => t + (a.likes || 0), 0)
      : 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pb-2 pt-12 border-b border-gray-200">
        <Text className="text-2xl font-bold text-black">Farmer Forum</Text>
        <Text className="text-sm text-gray-500 mt-1">Ask questions, share knowledge</Text>
      </View>
      {/* Search Bar Card */}
      <View className="mx-4 mt-5">
        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl p-3 shadow">
          <TextInput
            className="flex-1 text-base px-3 py-2"
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for questions"
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} className="ml-2 bg-emerald-600 px-3 py-2 rounded-xl">
            <Search size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Ask Button Card */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-emerald-600 mx-4 mt-6 mb-5 p-4 rounded-2xl shadow"
          onPress={() => setModalVisible(true)}
        >
          <MessageCircle size={20} color="#fff" />
          <Text className="text-white text-base font-semibold ml-2">Ask a Question</Text>
        </TouchableOpacity>
        {/* Questions, each in a card */}
        {questions.length === 0 && (
          <Text className="text-center text-gray-400 mt-8">No questions found.</Text>
        )}
        {questions
          .sort((a, b) => getTotalUpvotes(b) - getTotalUpvotes(a))
          .map((q) => (
            <TouchableOpacity
              key={q.id}
              className="bg-white mx-4 mb-6 px-5 py-4 rounded-2xl border-2 border-gray-100 shadow"
              onPress={() => openQuestion(q)}
            >
              <Text className="text-lg font-semibold text-black mb-3">{q.title || q.question}</Text>
              <View className="flex-row mb-3">
                <Text className="text-gray-500 mr-2">by {q.user?.username || q.author}</Text>
                <Text className="text-gray-400">{q.createdAt?.slice(0,10) || q.date}</Text>
              </View>
              <View className="flex-row space-x-6 mt-1 pt-2 border-t border-gray-100">
                <View className="flex-row items-center">
                  <MessageCircle size={16} color="#6b7280" />
                  <Text className="ml-1 text-gray-500">
                    {Array.isArray(q.answers) ? q.answers.length : q.answersCount} answers
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <ThumbsUp size={16} color="#16a34a" />
                  <Text className="ml-1 text-emerald-600 font-bold">{getTotalUpvotes(q)} upvotes</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Ask Question Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-5">
            <View className="flex-row justify-between mb-5">
              <Text className="text-xl font-bold">Ask a Question</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base min-h-[100px] text-gray-800"
              placeholder="Type your question..."
              value={newQuestion}
              onChangeText={setNewQuestion}
              multiline
            />
            <TouchableOpacity
              className="bg-emerald-600 rounded-lg py-4 mt-5"
              onPress={handleAskQuestion}
            >
              <Text className="text-white text-center font-semibold text-lg">Post Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Question Details Modal */}
      <Modal visible={selectedQuestion !== null} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-5 h-[90%]">
            <View className="flex-row justify-between mb-5">
              <Text className="text-xl font-bold">Question Details</Text>
              <TouchableOpacity onPress={() => setSelectedQuestion(null)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView className="flex-1">
              {selectedQuestion && (
                <>
                  <View className="bg-emerald-50 border-2 border-emerald-600 p-4 rounded-lg mb-5">
                    <Text className="text-lg font-semibold mb-3">{selectedQuestion.title || selectedQuestion.question}</Text>
                    <View className="flex-row">
                      <Text className="text-gray-700 mr-3">by {selectedQuestion.user?.username || selectedQuestion.author}</Text>
                      <Text className="text-gray-400">{selectedQuestion.createdAt?.slice(0,10) || selectedQuestion.date}</Text>
                    </View>
                  </View>
                  <Text className="text-lg font-bold mb-4">Answers ({answers.length})</Text>
                  {answers.length === 0 && (
                    <Text className="mb-3 text-gray-400">No answers yet.</Text>
                  )}
                  {answers
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                    .map((ans) => (
                      <View key={ans.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                        <Text className="text-base text-gray-800 mb-2">{ans.content || ans.answer}</Text>
                        <View className="flex-row mb-2">
                          <Text className="text-gray-500 mr-3">by {ans.user?.username || ans.author}</Text>
                          <Text className="text-gray-400">{ans.createdAt?.slice(0,10) || ans.date}</Text>
                        </View>
                        <TouchableOpacity
                          className="flex-row items-center py-1"
                          onPress={() => handleUpvote(ans.id)}
                        >
                          <ThumbsUp size={16} color="#16a34a" />
                          <Text className="ml-2 text-emerald-700 font-semibold">{ans.likes} upvotes</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  <View className="mt-5">
                    <Text className="text-base font-bold mb-3">Your Answer</Text>
                    <TextInput
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base min-h-[80px] text-gray-800"
                      placeholder="Write your answer..."
                      value={newAnswer}
                      onChangeText={setNewAnswer}
                      multiline
                    />
                    <TouchableOpacity
                      className="flex-row items-center justify-center bg-emerald-600 py-4 rounded-lg mt-4"
                      onPress={handlePostAnswer}
                    >
                      <Send size={18} color="#fff" />
                      <Text className="text-white text-lg font-semibold ml-2">Post Answer</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <NavigationBar navigation={navigation} />
    </View>
  );
}
