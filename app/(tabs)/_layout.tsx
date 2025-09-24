// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#4A90E2", // Primary color
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb", // Tailwind gray-200
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
            name="journal/index"
            options={{
            title: "Journals",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="journal" size={size} color={color} />
            ),
            }}
        />

        <Tabs.Screen
            name="insights/index"
            options={{
            title: "Insights",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart" size={size} color={color} />
            ),
            }}

        />  

        <Tabs.Screen
            name="support/index"
            options={{
            title: "Support",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="book" size={size} color={color} />
            ),
            }}
            
        />

        <Tabs.Screen
            name="profile/index"
            options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
            ),
            }}
        />


     
    </Tabs>
  );
}
