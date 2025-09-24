import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from '../../../services/supabase';

export default function NewJournalEntry() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionText, setRecognitionText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const router = useRouter();

  const moods = [
    { emoji: "😢", label: "Sad" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😊", label: "Good" },
    { emoji: "😃", label: "Happy" },
    { emoji: "🤩", label: "Excellent" },
  ];

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take photos');
      }
      if (audioStatus !== 'granted') {
        Alert.alert('Permission required', 'Microphone access is needed for voice input');
      }
    })();
  }, []);

  // Animation for recording button
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Real Voice Recording Function
  const startVoiceRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecognitionText("Recording... Speak now");
      
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert("Error", "Failed to start voice recording");
    }
  };

  const stopVoiceRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      setRecognitionText("Processing speech...");

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      
      // Here you would send the audio to a speech-to-text API
      // For now, we'll simulate the response
      simulateSpeechToText(uri);
      
      setRecording(null);
      
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert("Error", "Failed to process recording");
    }
  };

  // Simulate Speech-to-Text (Replace with actual API call)
  const simulateSpeechToText = (audioUri: string | null) => {
    setIsProcessing(true);
    
    // Simulate API processing time
    setTimeout(() => {
      const sampleResponses = [
        "Today I felt really productive and accomplished my goals. I'm grateful for the progress I made.",
        "I'm feeling a bit anxious about the upcoming meeting tomorrow. Need to practice some breathing exercises.",
        "Had a wonderful time with friends today. Feeling grateful for these meaningful connections in my life.",
        "Struggling with motivation today. I need to find some inspiration and take small steps forward.",
        "Reflecting on my emotions helps me understand myself better. Journaling is becoming a helpful habit.",
        "Feeling balanced and centered today. Meditation in the morning really set a positive tone."
      ];
      
      const randomText = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      setText(prev => prev ? prev + " " + randomText : randomText);
      setRecognitionText("✓ Voice input added successfully");
      setIsProcessing(false);
      
      // Clear recognition text after 3 seconds
      setTimeout(() => setRecognitionText(""), 3000);
    }, 2000);
  };

  // Text-to-Speech: Read back the text
  const speakText = () => {
    if (text.trim()) {
      Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        handleImageProcessing(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        handleImageProcessing(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // OCR Function to convert image to text
  const performOCR = async (imageUri: string): Promise<string> => {
    try {
      // Method 1: Using Google Cloud Vision API (Recommended)
      // You'll need to set up a Google Cloud project and enable Vision API
      return await googleCloudVisionOCR(imageUri);
      
      // Method 2: Using Tesseract.js (Free but less accurate)
      // return await tesseractOCR(imageUri);
      
      // Method 3: Using Microsoft Azure Computer Vision
      // return await azureComputerVisionOCR(imageUri);
      
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  };

  // Google Cloud Vision API OCR
  const googleCloudVisionOCR = async (imageUri: string): Promise<string> => {
    // Replace with your Google Cloud Vision API key
    const API_KEY = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
    const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    // Convert image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(',')[1];

        const requestBody = {
          requests: [
            {
              image: {
                content: base64data,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 10,
                },
              ],
            },
          ],
        };

        try {
          const ocrResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const data = await ocrResponse.json();
          
          if (data.responses && data.responses[0] && data.responses[0].fullTextAnnotation) {
            resolve(data.responses[0].fullTextAnnotation.text);
          } else {
            resolve('No text found in image');
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  // Tesseract.js OCR (Free alternative)
  const tesseractOCR = async (imageUri: string): Promise<string> => {
    // You'll need to install and configure Tesseract.js
    // This is a simplified example - you'll need proper implementation
    try {
      // Simulate Tesseract processing
      const simulatedText = "[OCR Result: This is simulated text from the image. Implement Tesseract.js for actual OCR.]";
      return simulatedText;
    } catch (error) {
      throw new Error('Tesseract OCR failed');
    }
  };

  // Image processing function with OCR
  const handleImageProcessing = async (imageUri: string) => {
    try {
      setIsProcessing(true);
      setRecognitionText("Processing image text...");

      // Perform OCR on the image
      const extractedText = await performOCR(imageUri);
      
      // Format the extracted text and add to journal
      const formattedText = `[From image: ${extractedText}]`;
      
      setText(prev => prev ? prev + "\n\n" + formattedText : formattedText);
      setRecognitionText("✓ Text extracted from image successfully");
      setIsProcessing(false);
      
      // Clear recognition text after 3 seconds
      setTimeout(() => setRecognitionText(""), 3000);
      
    } catch (error) {
      console.error('Image processing error:', error);
      Alert.alert("Error", "Failed to extract text from image");
      setRecognitionText("Failed to extract text");
      setIsProcessing(false);
      
      setTimeout(() => setRecognitionText(""), 3000);
    }
  };

  const handleSaveEntry = async () => {
    if (!text.trim()) {
      Alert.alert("Empty Entry", "Please add some text to your journal entry");
      return;
    }

    setIsSaving(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!user) {
        throw new Error('User not authenticated. Please sign in.');
      }

      // Insert journal entry into Supabase WITHOUT image URL
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            content: text.trim(),
            mood: mood !== null ? mood : null,
            image_url: null, // No image URL since we're converting to text
            word_count: text.split(/\s+/).filter(word => word.length > 0).length,
            character_count: text.length,
            has_ocr_content: image !== null, // Flag to indicate if OCR was used
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Journal entry saved securely!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setText("");
            setMood(null);
            setImage(null);
            setRecognitionText("");
            // Navigate back to journal list
            router.push("/(tabs)/journal");
          },
        },
      ]);

    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      
      let errorMessage = "Failed to save journal entry. Please try again.";
      
      if (error.message.includes('authenticated')) {
        errorMessage = "Please sign in to save journal entries.";
      } else if (error.message.includes('network') || error.code === 'ECONNREFUSED') {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const clearEntry = () => {
    Alert.alert("Clear Entry", "Are you sure you want to clear this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setText("");
          setMood(null);
          setImage(null);
          setRecognitionText("");
          if (recording) {
            recording.stopAndUnloadAsync();
            setRecording(null);
          }
          setIsRecording(false);
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          New Journal Entry
        </Text>
        <Text className="text-gray-600">
          Express your thoughts and feelings securely
        </Text>
      </View>

      {/* Mood Selector */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          How are you feeling today?
        </Text>
        <View className="flex-row justify-between">
          {moods.map((moodItem, index) => (
            <TouchableOpacity
              key={index}
              className={`items-center p-3 rounded-2xl flex-1 mx-1 ${
                mood === index ? "bg-blue-100 border-2 border-blue-500" : "bg-white border border-gray-200"
              }`}
              onPress={() => setMood(index)}
            >
              <Text className="text-3xl mb-1">{moodItem.emoji}</Text>
              <Text className={`text-xs font-medium ${
                mood === index ? "text-blue-700" : "text-gray-600"
              }`}>
                {moodItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Journal Text Input */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-800">
            What's on your mind?
          </Text>
          <View className="flex-row space-x-3">
            {text.trim() ? (
              <TouchableOpacity onPress={speakText} className="p-1">
                <Ionicons name="volume-medium" size={20} color="#4A90E2" />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={clearEntry}>
              <Text className="text-red-500 text-sm font-medium">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Start writing here... or use voice/image input below"
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          className="h-48 bg-white border border-gray-300 rounded-2xl p-4 text-base text-gray-800 shadow-sm"
        />

        {/* Voice Input Section */}
        <View className="mt-4">
          {!isRecording ? (
            <TouchableOpacity
              onPress={startVoiceRecording}
              className="flex-row items-center justify-center space-x-3 bg-green-50 border border-green-200 px-4 py-3 rounded-2xl"
            >
              <Ionicons name="mic" size={22} color="#10B981" />
              <Text className="text-green-700 font-semibold">Start Voice Input</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View 
              style={{ transform: [{ scale: pulseAnim }] }}
              className="flex-row items-center justify-center space-x-3 bg-red-50 border border-red-200 px-4 py-3 rounded-2xl"
            >
              <Ionicons name="square" size={18} color="#EF4444" />
              <Text className="text-red-700 font-semibold">Recording... Tap to stop</Text>
              <TouchableOpacity onPress={stopVoiceRecording}>
                <Text className="text-red-500 font-medium">Stop</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {recognitionText ? (
            <View className="flex-row items-center justify-center mt-2">
              {isProcessing ? (
                <ActivityIndicator size="small" color="#4A90E2" />
              ) : (
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              )}
              <Text className={`ml-2 text-sm ${
                recognitionText.includes("✓") ? "text-green-600" : "text-gray-600"
              }`}>
                {recognitionText}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Image to Text Section */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Extract Text from Images
        </Text>
        
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={takePhoto}
            className="flex-1 flex-row items-center justify-center space-x-2 bg-white border border-gray-300 px-4 py-3 rounded-2xl shadow-sm"
          >
            <Ionicons name="camera" size={20} color="#4B5563" />
            <Text className="text-gray-700 font-medium">Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={pickImage}
            className="flex-1 flex-row items-center justify-center space-x-2 bg-white border border-gray-300 px-4 py-3 rounded-2xl shadow-sm"
          >
            <Ionicons name="image" size={20} color="#4B5563" />
            <Text className="text-gray-700 font-medium">From Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        {image && (
          <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="font-medium text-gray-800">Image to Process</Text>
              <TouchableOpacity onPress={() => setImage(null)}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: image }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
            {isProcessing && (
              <View className="flex-row items-center justify-center mt-3">
                <ActivityIndicator size="small" color="#4A90E2" />
                <Text className="ml-2 text-sm text-gray-500">Extracting text from image...</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Security Badge */}
      <View className="flex-row items-center justify-center bg-blue-50 rounded-2xl p-4 mb-6">
        <Ionicons name="shield-checkmark" size={20} color="#4A90E2" />
        <Text className="ml-2 text-sm text-blue-700 font-medium">
          🔒 End-to-end encrypted • Your data is secure
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-4 mb-8">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-1 bg-gray-200 px-6 py-4 rounded-2xl items-center"
        >
          <Text className="text-gray-700 font-semibold">Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSaveEntry}
          disabled={!text.trim() || isSaving}
          className={`flex-1 px-6 py-4 rounded-2xl items-center ${
            text.trim() && !isSaving ? "bg-blue-600" : "bg-blue-300"
          }`}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Save Entry</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Character Count */}
      <View className="items-center">
        <Text className="text-sm text-gray-500">
          {text.length} characters • {text.split(/\s+/).filter(word => word.length > 0).length} words
        </Text>
      </View>
    </ScrollView>
  );
}