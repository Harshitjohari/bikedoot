import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions
}
  from 'react-native';

const width = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/home';
import MechanicHomeScreen from '../screens/home/mechanic';
import Login from '../screens/authentication/login';
import LoginStack  from '../navigation/stack';
import BookingsScreen from '../screens/bookings/my-bookings';
import MechanicBookingsScreen from '../screens/bookings/my-bookings-mechanic';
import BookingsDetails from '../screens/bookings/booking-details';
import MechanicBookingsDetails from '../screens/bookings/booking-details-mechanic';
import Mechanic from '../screens/mechanic';
import MechanicAdd from '../screens/mechanic/add';
import MechanicDetails from '../screens/mechanic//details';
import MechanicEdit from '../screens/mechanic/edit';
import AssignMechanic from '../screens/mechanic/assign';
import SettingsScreen from '../screens/settings';
import Profile from '../screens/settings/profile';
import ProfileMain from '../screens/profile';
import MechanicProfile from '../screens/profile/mechanic';
import MainStack from './stack'; // Assuming you have MainStack in another file
import SplashScreen from '../components/splash'
import ServicesList from '../screens/services'
import DateTimeSelectStep1 from '../screens/bookings/book-service';
import ServiceDetailPage from '../screens/services/details';
import SavedAddress from '../screens/settings/address';
import MyVehicles from '../screens/settings/my-vechicles';
import { useAuth } from '../context/loginContext';
import BookingConfirmation from '../screens/bookings/book-service/booking-success'
import InseptionScreen from '../screens/bookings/inseption-list'
import AddOnScreen from '../screens/bookings/add-ons'
import SpareListScreen from '../screens/bookings/spare-list'
import SpareEdit from '../screens/bookings/spare-list/edit'
import OtpVerify from '../screens/bookings/booking-otp'
import FinishService from '../screens/bookings/mechanic-finish-service'
import AddPayment from '../screens/bookings/add-payment'
import Rating from '../screens/bookings/rating'
import Store from '../screens/store'
import Earnings from '../screens/earnings'
import EarningDetail from '../screens/earnings/detail'

import { imageConstant } from '../utils/constant';

const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator()
const HomeStack = createStackNavigator()
const HomeBookingStack = createStackNavigator()
const MechanicHomeStack = createStackNavigator()
const MechanicBookingStack = createStackNavigator()
const MechanicProfileStack = createStackNavigator()
const ProfileStack = createStackNavigator()
const EarningStack = createStackNavigator()

const MainNavigator = (props) => {

  const { loadUserDataFromStorage, clearAuthData } = useAuth();
  const [isLoggedIn, setLoggedIn] = useState(null);

  const { token, userData } = useAuth();


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

  // console.log('ROLE======================>', userData?.role?.type)

  // const SettingsStackScreen = () => (
  //   <SettingsStack.Navigator screenOptions={{
  //     headerShown: false
  //   }}>
  //     <SettingsStack.Screen name="Settings">
  //       {(props) => <SettingsScreen {...props} logout={logout} />}
  //     </SettingsStack.Screen>
  //     <SettingsStack.Screen name="Profile" component={Profile} />
  //     <SettingsStack.Screen name="SavedAddress" component={SavedAddress} />
  //     <SettingsStack.Screen name="MyVehicles" component={MyVehicles} />
  //     {/* Add more screens for BookingsStack if needed */}
  //   </SettingsStack.Navigator>
  // );


  const HomeStackScreen = (props) => (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      {/* <HomeStack.Screen name="Home">
        {(props) => <HomeScreen {...props} logout={logout} />}
      </HomeStack.Screen> */}
      <HomeStack.Screen name="ServicesList" component={ServicesList} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="DateTimeSelectStep1" component={DateTimeSelectStep1} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="ServiceDetailPage" component={ServiceDetailPage} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingConfirmation" component={BookingConfirmation} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Bookings" component={BookingsScreen} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingsDetails" component={BookingsDetails} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Mechanic" component={Mechanic} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="MechanicAdd" component={MechanicAdd} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="MechanicDetails" component={MechanicDetails} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="MechanicEdit" component={MechanicEdit} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="AssignMechanic" component={AssignMechanic} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Earnings" component={Earnings} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="EarningDetail" component={EarningDetail} options={{ tabBarVisible: false }} />

      <HomeStack.Screen name="ProfileMain">
        {(props) => <ProfileMain {...props} logout={logout} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="SavedAddress" component={SavedAddress} />
      <HomeStack.Screen name="MyVehicles" component={MyVehicles} />
      <HomeStack.Screen name="Login" component={Login} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="MainStack" component={MainStack} options={{ tabBarVisible: false }} />

    </HomeStack.Navigator>
  );

  const HomeBookingStack = (props) => (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <HomeStack.Screen name="Bookings" component={BookingsScreen} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="BookingsDetails" component={BookingsDetails} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="AssignMechanic" component={AssignMechanic} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="Mechanic" component={Mechanic} options={{ tabBarVisible: false }} />
      <HomeStack.Screen name="MechanicAdd" component={MechanicAdd} options={{ tabBarVisible: false }} />
    </HomeStack.Navigator>
  );

  const EarningsStack = (props) => (
    <EarningStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <EarningStack.Screen name="Earnings" component={Earnings} options={{ tabBarVisible: false }} />
      <EarningStack.Screen name="EarningDetail" component={EarningDetail} options={{ tabBarVisible: false }} />
    </EarningStack.Navigator>
  );

  const ProfileStack = (props) => (
    <HomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <HomeStack.Screen name="ProfileMain">
        {(props) => <ProfileMain {...props} logout={logout} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Login" component={Login} options={{ tabBarVisible: false }} />
    </HomeStack.Navigator>
  );

  const MechanicHomeStackScreen = (props) => (
    <MechanicHomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <MechanicHomeStack.Screen name="MechanicHome" component={MechanicHomeScreen} />
      <MechanicHomeStack.Screen name="MechanicBookingsDetails" component={MechanicBookingsDetails} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="MechanicBookingsScreen" component={MechanicBookingsScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="InseptionScreen" component={InseptionScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="AddOnScreen" component={AddOnScreen} options={{ tabBarVisible: false }} />
      {/* <MechanicHomeStack.Screen name="MechanicProfile" component={MechanicProfile} options={{ tabBarVisible: false }} /> */}
      <MechanicHomeStack.Screen name="SpareListScreen" component={SpareListScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="SpareEdit" component={SpareEdit} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="OtpVerify" component={OtpVerify} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="FinishService" component={FinishService} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="AddPayment" component={AddPayment} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="Rating" component={Rating} options={{ tabBarVisible: false }} />

      <MechanicHomeStack.Screen name="MechanicProfile">
        {(props) => <MechanicProfile {...props} logout={logout} />}
      </MechanicHomeStack.Screen>
      <MechanicHomeStack.Screen name="Login" component={Login} options={{ tabBarVisible: false }} />

    </MechanicHomeStack.Navigator>
  );

  const MechanicProfileStack = (props) => (
    <MechanicHomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
        <MechanicHomeStack.Screen name="MechanicProfile">
        {(props) => <MechanicProfile {...props} logout={logout} />}
      </MechanicHomeStack.Screen>
      <MechanicHomeStack.Screen name="Login" component={Login} options={{ tabBarVisible: false }} />

    </MechanicHomeStack.Navigator>
  );

  const MechanicBookingStack = (props) => (
    <MechanicHomeStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <MechanicHomeStack.Screen name="MechanicBookingsScreen" component={MechanicBookingsScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="MechanicBookingsDetails" component={MechanicBookingsDetails} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="InseptionScreen" component={InseptionScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="AddOnScreen" component={AddOnScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="SpareListScreen" component={SpareListScreen} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="SpareEdit" component={SpareEdit} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="OtpVerify" component={OtpVerify} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="FinishService" component={FinishService} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="AddPayment" component={AddPayment} options={{ tabBarVisible: false }} />
      <MechanicHomeStack.Screen name="Rating" component={Rating} options={{ tabBarVisible: false }} />
      {/* <MechanicHomeStack.Screen name="Mainstack" component={<MainStack/>} options={{ tabBarVisible: false }} /> */}
    </MechanicHomeStack.Navigator>
  );


  // If isLoggedIn is still null (loading state), show the SplashScreen
  if (isLoggedIn === null) {
    return <SplashScreen />
  }

  if (!isLoggedIn) {
    return (<MainStack {...props} onLogin={handleLoginStatusChange} />)
  }
  // else if (true) {
  //   return (<HomeStackScreen />)
  // } 
  else {
    let role = userData?.role?.type
    if (role == 'GARAGE_ADMIN') {

      return (
        <Tab.Navigator
          lazy={false}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              if (route.name === 'Home') {
                // return <Image source={focused ? imageConstant.home : imageConstant.home1} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.home : imageConstant.home1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Home</Text>
                  </View>
                );
              }
              else if (route.name === 'Bookings') {
                // return <Image source={focused ? imageConstant.bookings : imageConstant.bookings1} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.bookings : imageConstant.bookings1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Bookings</Text>
                  </View>
                );
              }
              else if (route.name === 'Spares') {
                // return <Image source={focused ? imageConstant.spares : imageConstant.spares1} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.spares : imageConstant.spares1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Store</Text>
                  </View>
                );
              }
              else if (route.name === 'Earnings') {
                // return <Image source={focused ? imageConstant.earnings : imageConstant.earnings1} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.earnings : imageConstant.earnings1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Earnings</Text>
                  </View>
                );
              }
              else if (route.name === 'Profile') {
                // return <Image source={focused ? imageConstant.profile : imageConstant.profile1} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.profile : imageConstant.profile1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Profile</Text>
                  </View>
                );
              }
            },
            tabBarShowLabel: false,
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarStyle: {
              backgroundColor: "white",
              height: Platform.OS == 'ios' ? hp('10%') : width / 5.8,
              width: width,
              justifyContent: "space-evenly",
            }

          })}>
          <Tab.Screen name="Home" component={HomeStackScreen} options={{
            tabBarLabel: "Home",
            unmountOnBlur: true,
          }} />
          <Tab.Screen name="Bookings" component={HomeBookingStack} />
          <Tab.Screen name="Spares" component={Store} />
          <Tab.Screen name="Earnings" component={EarningsStack} />
          <Tab.Screen name="Profile" component={ProfileStack} />
          {/* <Tab.Screen name="Settings" component={SettingsStackScreen} /> */}
        </Tab.Navigator>
      );

    } else {

      return (
        <Tab.Navigator
          lazy={false}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              if (route.name === 'MechanicHome') {
                // return <Image source={focused ? imageConstant.home1 : imageConstant.home} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.home : imageConstant.home1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Home</Text>
                  </View>
                );
              }
              else if (route.name === 'MechanicBookingsScreen') {
                // return <Image source={focused ? imageConstant.bookings1 : imageConstant.bookings} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.bookings : imageConstant.bookings1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Bookings</Text>
                  </View>
                );
              }
              else if (route.name === 'Earnings') {
                // return <Image source={focused ? imageConstant.earnings1 : imageConstant.earnings} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.earnings : imageConstant.earnings1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Earnings</Text>
                  </View>
                );
              }
              else if (route.name === 'MechanicProfile') {
                // return <Image source={focused ? imageConstant.profile1 : imageConstant.profile} style={{ width: 30, height: 30, marginBottom: 10 }} />
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Image source={focused ? imageConstant.profile : imageConstant.profile1} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    <Text style={{ color: focused ? 'blue' : 'gray', fontWeight:500, fontSize : 13 }}>Profile</Text>
                  </View>
                );
              }
            },
            tabBarShowLabel: false,
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarStyle: {
              backgroundColor: "white",
              height: Platform.OS == 'ios' ? hp('10%') : width / 5.8,
              width: width,
              justifyContent: "space-evenly",
            }

          })}>
          <Tab.Screen name="MechanicHome" component={MechanicHomeStackScreen} options={{
            tabBarLabel: "MechanicHome",
            unmountOnBlur: true,
          }} />
          <Tab.Screen name="MechanicBookingsScreen" component={MechanicBookingStack} />
          <Tab.Screen name="Earnings" component={MechanicBookingsScreen} />
          <Tab.Screen name="MechanicProfile" component={MechanicProfileStack} />
        </Tab.Navigator>
      );

    }
  }

};

export default MainNavigator;
