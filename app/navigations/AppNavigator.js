// app/navigations/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyListsScreen from '../screens/MyListsScreen';
import SharedListsScreen from '../screens/SharedListsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AddListScreen from '../screens/AddListScreen';
import ListDetailsScreen from '../screens/ListDetailsScreen';
import { FontAwesome6 } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="My Lists"
      component={MyListsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome6 name="user-large" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Shared Lists"
      component={SharedListsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome6 name="users" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome6 name="gear" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddList"
        component={AddListScreen}
        options={{ title: 'Add List' }}
      />
      <Stack.Screen
        name="ListDetails"
        component={ListDetailsScreen}
        options={({ route }) => ({ title: route.params.listName || 'List Details' })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;