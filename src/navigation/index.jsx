import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/home';
import BookingsScreen from '../screens/bookings/my-bookings';
import BookingsScreenDetail from '../screens/bookings/booking-details';
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
import OtpVerify from '../screens/bookings/booking-otp'
import ApprovedPreInspection from '../screens/bookings/approved-pre-inspection'
import Rating from '../screens/bookings/rating'

const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator()
const HomeStack = createStackNavigator()
const BookingStack = createStackNavigator()

const MainNavigator = (props) => {

  const { loadUserDataFromStorage, clearAuthData } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setTimeout(() => {
          setLoggedIn(!!userToken);
        }, 1000)
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    loadUserDataFromStorage();
    checkLoginStatus();
  }, []);

  const logout = async () => {
    try {
      clearAuthData()
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
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )

  const HomeStackScreen = (props) => (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ServicesList" component={ServicesList} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="DateTimeSelectStep1" component={DateTimeSelectStep1} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="ServiceDetailPage" component={ServiceDetailPage} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingConfirmation" component={BookingConfirmation} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Bookings" component={BookingsScreen} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingsScreenDetail" component={BookingsScreenDetail} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="OtpVerify" component={OtpVerify} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="ApprovedPreInspection" component={ApprovedPreInspection} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Rating" component={Rating} options={{ tabBarVisible: false }} />

      <HomeStack.Screen name="Settings">
        {(props) => <SettingsScreen {...props} logout={logout} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Profile" component={Profile} />
      <HomeStack.Screen name="SavedAddress" component={SavedAddress} />
      <HomeStack.Screen name="MyVehicles" component={MyVehicles} />
    </HomeStack.Navigator>
  );

  const BookingStack = (props) => (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <HomeStack.Screen name="Bookings" component={BookingsScreen} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingsScreenDetail" component={BookingsScreenDetail} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="OtpVerify" component={OtpVerify} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="ApprovedPreInspection" component={ApprovedPreInspection} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Rating" component={Rating} options={{ tabBarVisible: false }} />

    </HomeStack.Navigator>
  );

  // If isLoggedIn is still null (loading state), show the SplashScreen
  if (isLoggedIn === null) {
    return <SplashScreen />
  }

  if (!isLoggedIn)
    return (<MainStack {...props} onLogin={handleLoginStatusChange} />)
  // else if (true) {
  //   return (<HomeStackScreen />)
  // } 
  else
    return (
      <Tab.Navigator
        lazy={false}
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
        })}
        tabBarOptions={{
          activeTintColor: '#5349f8',
          inactiveTintColor: '#A9A9A9',
        }}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Bookings" component={BookingStack} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    );
};

export default MainNavigator;
