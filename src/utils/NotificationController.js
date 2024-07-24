import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {navigate} from '../navigation/NavigationService';

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

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });


  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });



  PushNotification.configure({
    onNotification: (notification) => {
      console.log('onNotification-------------touched object', notification.data);
      if(notification.data.for === "mechanic"){
        navigate("MechanicBookingsScreen",{ id: notification.data?.bookingId })
        // navigate("MechanicBookingsDetails", { id:_id })
      }
      if(notification.data.for === "garage"){
        navigate("BookingsScreen",{ id: notification.data?.bookingId })
        // navigate("BookingsDetails", { id:_id })
      }
    },
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
}

//server key
//AAAA7hxgyDY:APA91bFd0U6-aUw-Cu1gnF-lRUB5rO6cLw3pYitMqfHHbBU2vmRBKh6mCnLBuvxwRzDQ7kIiGrQlk5UoNJj03kLfyxUTpOEyNmokCVWE9ajJYQmcHMZsR3gIwRpjokMkiZgCIV3Cprnb
