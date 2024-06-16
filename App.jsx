import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import theme from './src/theme';
import MainNavigator from "./src/navigation";
import { AuthProvider } from './src/context/loginContext';
import GpsCheck from './src/utils/gpsCheck';

const App = () => {
  return (<NativeBaseProvider theme={theme}>
    <NavigationContainer>
      <AuthProvider>
      {/* <GpsCheck />         */}
      <MainNavigator />
      </AuthProvider>
    </NavigationContainer>
  </NativeBaseProvider>
  )
}


export default App;
