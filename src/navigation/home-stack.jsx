import React, { useLayoutEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import HomeScreen from '../screens/home';
import ServicesList from '../screens/services'

const HomeStack = createStackNavigator();

const HomeStackScreen = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = () => {
        // Hide bottom tabs on screen focus
        navigation.setOptions({
          tabBarVisible: false,
        });
      };

      // Show bottom tabs on screen blur
      return unsubscribe;
    }, [navigation])
  );

  useLayoutEffect(() => {
    return () => {
      // Show bottom tabs when leaving the screen
      navigation.setOptions({
        tabBarVisible: true,
      });
    };
  }, [navigation]);

  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ServicesList" component={ServicesList} />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
