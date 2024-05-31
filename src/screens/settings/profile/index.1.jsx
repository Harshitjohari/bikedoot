import React, { useState } from 'react';
import { View } from 'react-native';
import { Box, Heading, Avatar, Input, Button, Toast } from 'native-base';

const ProfileScreen = () => {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('1234567890');
  const [email, setEmail] = useState('john.doe@example.com');

  const showToastError = (message) => {
    Toast.show({
      title: 'Error',
      status: 'error',
      description: message,
      duration: 3000,
      placement: 'top',
    });
  };

  const isValidEmail = (value) => {
    // Add your email validation logic here
    // For simplicity, I'm using a basic regex pattern
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(value);
  };

  const handleUpdateProfile = () => {
    // Validate inputs (you can add more validations)
    if (!name.trim()) {
      showToastError('Name is required');
      return;
    }

    if (!phone.trim()) {
      showToastError('Phone is required');
      return;
    }

    if (!isValidEmail(email)) {
      showToastError('Invalid email');
      return;
    }

    // Submit data to the server

    // Show success toast
    Toast.show({
      title: 'Success',
      status: 'success',
      description: 'Profile updated successfully!',
      duration: 3000,
      placement: 'top',
    });
  };

  return (
    <Box flex={1} alignItems="center" justifyContent="center" p={4}>
      <Avatar
        size="xl"
        source={{
          uri: 'https://picsum.photos/200/300',
        }}
      />
      <Heading mt={4} mb={2}>
        Edit Profile
      </Heading>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={(value) => setName(value)}
        mt={3}
      />
      <Input
        placeholder="Phone"
        value={phone}
        onChangeText={(value) => setPhone(value)}
        mt={3}
        keyboardType="phone-pad"
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        mt={3}
        keyboardType="email-address"
      />
      <Button onPress={handleUpdateProfile} mt={5}>
        Update Profile
      </Button>
    </Box>
  );
};

export default ProfileScreen;
