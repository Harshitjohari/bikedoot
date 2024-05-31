import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/home';
import BookingsScreen from '../screens/bookings/my-bookings';
import SettingsScreen from '../screens/settings';
import Profile from '../screens/settings/profile';
import MainStack from './stack'; // Assuming you have MainStack in another file
import SplashScreen from '../components/splash'
import ServicesList from '../screens/services'
import DateTimeSelectStep1 from '../screens/bookings/book-service';
import ServiceDetailPage from '../screens/services/details';
import SavedAddress from '../screens/settings/address';
import MyVehicles from '../screens/settings/my-vechicles';
import { useAuth } from '../context/loginContext';
import BookingConfirmation from '../screens/bookings/book-service/booking-success'
const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator()
const HomeStack = createStackNavigator()

const MainNavigator = (props) => {

  const { loadUserDataFromStorage, loadCityDataFromStorage } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setLoggedIn(!!userToken);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    loadUserDataFromStorage();
    loadCityDataFromStorage();
    checkLoginStatus();
  }, []);

  const logout = async () => {
    try {
      alert("df")
      // Clear the authentication token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      // Update the state to reflect the user being logged out
      setLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const handleLoginStatusChange = (loggedIn) => {
    setLoggedIn(loggedIn);
  };

  const SettingsStackScreen = () => (
    <SettingsStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <SettingsStack.Screen name="Settings">
        {(props) => <SettingsScreen {...props} logout={logout} />}
      </SettingsStack.Screen>
      <SettingsStack.Screen name="Profile" component={Profile} />
      <SettingsStack.Screen name="SavedAddress" component={SavedAddress} />
      <SettingsStack.Screen name="MyVehicles" component={MyVehicles} />
      {/* Add more screens for BookingsStack if needed */}
    </SettingsStack.Navigator>
  );


  const Tabss = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            // Set your custom icon for Home tab
            iconName = 'home';
          } else if (route.name === 'Bookings') {
            // Set your custom icon for Bookings tab
            iconName = 'list';
          } else if (route.name === 'Settings') {
            // Set your custom icon for Settings tab
            iconName = 'sliders';
          }
          // Return your custom icon component
          return <Icon name={iconName} size={size} color={color} type="FontAwesome5" />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )

  const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <HomeStack.Screen name="Home" component={Tabss} />
      <HomeStack.Screen name="ServicesList" component={ServicesList} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="DateTimeSelectStep1" component={DateTimeSelectStep1} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="ServiceDetailPage" component={ServiceDetailPage} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingConfirmation" component={BookingConfirmation} options={{ tabBarVisible: false }} />

      <HomeStack.Screen name="Settings">
        {(props) => <SettingsScreen {...props} logout={logout}/>}
      </HomeStack.Screen>
      <HomeStack.Screen name="Profile" component={Profile} />
      <HomeStack.Screen name="SavedAddress" component={SavedAddress} />
      <HomeStack.Screen name="MyVehicles" component={MyVehicles} />
    </HomeStack.Navigator>
  );

  // If isLoggedIn is still null (loading state), show the SplashScreen
  if (isLoggedIn === null) {
    return <SplashScreen />;
  }

  if (!isLoggedIn)
    return (<MainStack {...props} onLogin={handleLoginStatusChange} />)
  else if (true) {
    return (<HomeStackScreen />)
  } else
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              // Set your custom icon for Home tab
              iconName = 'home';
            } else if (route.name === 'Bookings') {
              // Set your custom icon for Bookings tab
              iconName = 'list';
            } else if (route.name === 'Settings') {
              // Set your custom icon for Settings tab
              iconName = 'sliders';
            }
            // Return your custom icon component
            return <Icon name={iconName} size={size} color={color} type="FontAwesome5" />;
          },
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Bookings" component={BookingsScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    );
};

export default MainNavigator;
