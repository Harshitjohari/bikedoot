import React from 'react';
import { View, Spinner, Text } from 'native-base';

const LoadingSpinner = ({ text = "Loading Please wait.." }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} pt={20}>
            <Spinner color="blue" />
            <Text fontWeight="400" fontSize="bd_xsm" mb={0} lineHeight="16px" color="bd_sec_text">
                {text}
            </Text>
        </View>
    );
};

export default LoadingSpinner;
