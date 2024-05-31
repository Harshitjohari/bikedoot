// MainStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/authentication/login';
import VerifyOTP from '../screens/authentication/otp';
import AddProfile from '../screens/authentication/add-profile';

const Stack = createStackNavigator();

const MainStack = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="VerifyOTP">
        {(screenProps) => <VerifyOTP {...screenProps} onLogin={props.onLogin} />}
      </Stack.Screen>

      <Stack.Screen name="AddProfile">
        {(screenProps) => <AddProfile {...screenProps} onLogin={props.onLogin} />}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default MainStack;
