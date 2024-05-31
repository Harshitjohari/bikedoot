// MainStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/settings/profile';
import Mechanic from '../screens/mechanic';
// import AddAddressScreen from '../screens/AddAddressScreen';

const Stack = createStackNavigator();

const AfterLoginStack = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile}/>
      
      {/* <Stack.Screen name="AddAddress" component={AddAddressScreen} /> */}
    </Stack.Navigator>
  );
};

export default AfterLoginStack;
