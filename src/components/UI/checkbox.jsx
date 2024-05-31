import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const Checkbox = ({ children, onChange, isChecked }) => {
    const toggleCheckbox = () => {
        onChange(!isChecked);
    };

    return (
        <TouchableOpacity onPress={toggleCheckbox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 20,
                        height: 20,
                        borderWidth: 1,
                        borderColor: 'black',
                        backgroundColor: isChecked ? 'blue' : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {isChecked && <Text style={{ color: 'white' }}>✓</Text>}
                </View>{children}
            </View>
        </TouchableOpacity>
    );
};

export default Checkbox;
