import React, { useEffect, useState } from 'react';
import { Alert, Button, View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const GpsCheck = () => {
  const [gpsEnabled, setGpsEnabled] = useState(false);

  useEffect(() => {
    checkGPS();
  }, []);

  const checkGPS = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        // console.log('=============>',position);
        setGpsEnabled(true);
      },
      (error) => {
        Alert.alert(
          'GPS not enabled',
          'Please enable GPS to use this app.',
          [
            { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          ],
          { cancelable: false }
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  // if (!gpsEnabled) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Please enable GPS to use this app.</Text>
  //       {/* <Button title="Enable GPS"/> */}
  //     </View>
  //   );
  // }
};

export default GpsCheck;
