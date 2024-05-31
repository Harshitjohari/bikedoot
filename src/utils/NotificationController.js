import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Storage from '../utils/async-storage';
import { Alert } from 'react-native';


// Initialize Firebase
export const initializeFirebase = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

// Get FCM token
export const getToken = async () => {
  try {
    const token = await messaging().getToken();
    // console.log('FCM Token:==================>', token);
    // await Storage.setDataInStorage('fcmToken', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

// Handle background messages
export const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!=======>', remoteMessage);
  });
};

// Handle foreground messages
export const onMessage = () => {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:==================>', remoteMessage);
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage.notification));
  });
};

//callback foregroung handler
export const onMessageCallBack = (callback) => {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);
    if (callback) {
      callback(remoteMessage);
    }
  });
};

//in other file for using firebase module
// onMessage((remoteMessage) => {
//   console.log('Received message:', remoteMessage);
// });
// useEffect(() => {
//   const messageHandler = (remoteMessage) => {
//     console.log('Received message:', remoteMessage);
//   };

//   onMessage(messageHandler);

// }, []);