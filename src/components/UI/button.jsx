// CustomButton.js

import React from 'react';
import { Button, Text } from 'native-base';
import CommonStyle from '../../assets/style';

const CustomButton = ({ textStyle, btnStyle, isLoading, isLoadingText, onPress, children, ...rest }) => {
    return (
        <Button style={{ ...CommonStyle.button, ...btnStyle }} disabled={isLoading} onPress={onPress} {...rest}>
            {isLoading ? (
                <Text style={{ ...CommonStyle.buttonText, ...textStyle }}>{isLoadingText}</Text>
            ) : (
                    <Text style={{ ...CommonStyle.buttonText, ...textStyle }}>{children}</Text>
                )}
        </Button>
    );
};

export default CustomButton;
