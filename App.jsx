import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import theme from './src/theme';
import MainNavigator from "./src/navigation";
import { AuthProvider } from './src/context/loginContext';
import NotificationControllerForeground from './src/utils/NotificationControllerForeground';

const App = () => {
  return (<NativeBaseProvider theme={theme}>
    <NotificationControllerForeground/>
    <NavigationContainer>
      <AuthProvider>
      <MainNavigator />
      </AuthProvider>
    </NavigationContainer>
  </NativeBaseProvider>
  )
}


export default App;
