import React from 'react';
import { Input, Text } from 'native-base';

const CustomInput = ({
  placeholder,
  keyboardType,
  maxLength,
  value,
  onChangeText,
  error,
  validation,
}) => {
  const validateInput = () => {
    if (validation && typeof validation === 'function') {
      return validation(value);
    }
    return false;
  };

  return (
    <>
      <Input
        borderRadius={50}
        style={/* Your CommonStyle.input or any custom style */}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        isInvalid={validateInput()}
      />
      {validateInput() && (
        <Text color="red.500" pt={0} mb={3} fontSize={12}>
          {error}
        </Text>
      )}
    </>
  );
};

export default CustomInput;
