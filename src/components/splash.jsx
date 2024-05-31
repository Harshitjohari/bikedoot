import React from 'react';
import { View, Text, Image } from 'react-native';
import { imageConstant } from '../utils/constant';


const SplashScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={imageConstant.splash} style={{ height: 150, width: 150, resizeMode: "contain", marginBottom: 10 }} />
      {/* <Text fontWeight="600" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text" mt={5}>
        Bikedoot is loading is features..
            </Text> */}
    </View>
  );
};

export default SplashScreen;
