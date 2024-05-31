import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import theme from './src/theme';
import MainNavigator from "./src/navigation";
import { AuthProvider } from './src/context/loginContext';

const App = () => {
  return (<NativeBaseProvider theme={theme}>
    <NavigationContainer>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </NavigationContainer>
  </NativeBaseProvider>
  )
}


export default App;
