import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NewJournalEntry() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  const moods = ["😢", "😐", "😊", "😃", "🤩"];

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleOCR(result.assets[0].base64 || "");
    }
  };

  // Placeholder OCR function
  const handleOCR = async (base64Image: string) => {
    try {
      setIsProcessing(true);

      // 🚀 Replace this with real OCR logic (Tesseract.js / API call)
      // Example: const textFromImage = await myOCRService(base64Image);
      const textFromImage = "[Detected text from image would appear here]";

      setText((prev) => prev + "\n" + textFromImage);
    } catch (error) {
      Alert.alert("Error", "Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleentry = () => {
    router.push("/(tabs)/journal");
    setText("");
    setMood(null);
    setImage(null);
  }

  return (
    <ScrollView className="flex-1 bg-white p-5">
      {/* Header */}
      <Text className="text-2xl font-semibold text-dark mb-4">
        New Journal Entry
      </Text>

      {/* Mood Selector */}
      <Text className="text-base font-medium text-dark mb-2">
        How are you feeling?
      </Text>
      <View className="flex-row space-x-4 mb-6">
        {moods.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            className={`p-2 rounded-full ${
              mood === index ? "bg-primary" : "bg-gray-200"
            }`}
            onPress={() => setMood(index)}
          >
            <Text className="text-2xl">{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Journal Text Input */}
      <Text className="text-base font-medium text-dark mb-2">
        What's on your mind?
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Start writing here..."
        multiline
        className="h-40 border border-gray-300 rounded-xl p-3 text-base text-dark"
      />

      {/* Image Upload */}
      <View className="mt-6">
        <Text className="text-base font-medium text-dark mb-2">
          Add Image (auto-converts to text)
        </Text>
        <TouchableOpacity
          onPress={pickImage}
          className="flex-row items-center space-x-2 bg-gray-100 px-4 py-3 rounded-xl"
        >
          <Ionicons name="image" size={20} color="#4A90E2" />
          <Text className="text-primary font-medium">Upload Image</Text>
        </TouchableOpacity>

        {image && (
          <View className="mt-4">
            <Image
              source={{ uri: image }}
              className="w-full h-40 rounded-lg"
              resizeMode="cover"
            />
            {isProcessing && (
              <Text className="mt-2 text-sm text-gray-500">Processing image...</Text>
            )}
          </View>
        )}
      </View>

      {/* Encryption Badge */}
      <View className="flex-row items-center mt-4">
        <Ionicons name="lock-closed" size={18} color="#4A90E2" />
        <Text className="ml-2 text-sm text-gray-500">
          🔒 This entry is secure and encrypted
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-8">

        <TouchableOpacity className="bg-primary px-6 py-3 rounded-2xl" onPress={handleentry}>
          <Text className="text-white font-medium">Save Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
