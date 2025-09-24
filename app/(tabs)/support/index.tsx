import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

interface QuickActionButtonProps {
    title: string;
    onPress: () => void;
}

const InitialMessage: Message = {
  id: '1',
  text: "Hi there! How can I help you today?",
  sender: 'bot',
};

const cleanText = (text: string) => {
  return text.replace(/[#*_~`]/g, '').replace(/\n\s*\n/g, '\n').trim();
};

export default function MentalHealthChatScreen() {
  const [messages, setMessages] = useState<Message[]>([InitialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const GEMINI_API_KEY = "AIzaSyAQN4TXgFHCEyH5khyNxvopZD_WNmkStOs";
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

  const MENTAL_HEALTH_PROMPT = `You are a compassionate, professional mental health supporter. Your role is to provide empathetic listening, emotional support, and evidence-based guidance while maintaining professional boundaries.

Key guidelines:
- Respond with warmth, empathy, and understanding
- Use active listening techniques and validate feelings
- Provide practical coping strategies when appropriate
- Maintain professional boundaries
- Avoid medical diagnoses or specific treatment recommendations
- Encourage professional help when needed
- Keep responses conversational and natural
- Focus on the present moment and the person's current experience
- Use clear, accessible language without markdown formatting

Always respond in a way that makes the person feel heard, respected, and supported.`;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardOffset(e.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      text: input, 
      sender: 'user' 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `${MENTAL_HEALTH_PROMPT}\n\nUser message: ${input}`
            }]
          }]
        }
      );

      const botMessageText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!botMessageText) {
        throw new Error('No valid response from API');
      }

      const cleanedText = cleanText(botMessageText);
      const botMessage: Message = {
        id: Date.now().toString() + 'b',
        text: cleanedText,
        sender: 'bot',
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: 'error', 
        text: 'Sorry, I am unable to connect right now. Please try again.', 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, onPress }) => (
    <TouchableOpacity 
      className="bg-white border border-gray-300 rounded-full px-4 py-2 mr-2 mb-2"
      onPress={onPress}
    >
      <Text className="text-gray-700 text-sm">{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white py-4 px-6 border-b border-gray-200">
        <Text className="text-xl font-semibold text-gray-900 text-center">MasterMind</Text>
      </View>

      {/* Main Content with Keyboard Handling */}
      <View className="flex-1">
        {/* Chat Messages */}
        <View className="flex-1 px-4">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className={`my-2 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <Text className={`text-xs text-gray-500 mb-1 ${item.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {item.sender === 'user' ? 'You' : 'Support Bot'}
                </Text>
                <View className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                  item.sender === 'user' 
                    ? 'bg-blue-500 rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}>
                  <Text className={
                    item.sender === 'user' 
                      ? 'text-white' 
                      : 'text-gray-800'
                  }>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          {isTyping && (
            <View className="items-start my-2">
              <Text className="text-xs text-gray-500 mb-1">Master Mind</Text>
              <View className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                <Text className="text-gray-400 italic">Master Mind is typing...</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions
        <View className="px-4 py-3 border-t border-gray-200 bg-white">
          <Text className="text-sm font-medium text-gray-700 mb-2">Quick Help</Text>
          <View className="flex-row flex-wrap">
            <QuickActionButton 
              title="Breathing Exercise" 
              onPress={() => {
                setInput("Can you guide me through a breathing exercise?");
                Keyboard.dismiss();
              }}
            />
            <QuickActionButton 
              title="Grounding Techniques" 
              onPress={() => {
                setInput("What are some grounding techniques I can try?");
                Keyboard.dismiss();
              }}
            />
            <QuickActionButton 
              title="Feeling Anxious" 
              onPress={() => {
                setInput("I'm feeling anxious right now");
                Keyboard.dismiss();
              }}
            />
            <QuickActionButton 
              title="Stress Relief" 
              onPress={() => {
                setInput("What can I do to relieve stress?");
                Keyboard.dismiss();
              }}
            />
          </View>
        </View> */}
      </View>

      {/* Input Area - Fixed at bottom with keyboard offset */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View 
          className="bg-white border-t border-gray-200 px-4 py-3"
          style={Platform.OS === 'ios' ? {} : { marginBottom: keyboardOffset }}
        >
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 h-12 bg-gray-100 rounded-full px-4 text-gray-800 mr-2"
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#9ca3af"
              multiline
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              className={`w-12 h-12 rounded-full items-center justify-center ${
                input.trim() ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <Text className="text-white text-lg font-bold">↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}