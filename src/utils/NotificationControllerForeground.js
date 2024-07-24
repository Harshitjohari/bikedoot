import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

const NotificationControllerForeground = (props) => {
  useEffect(() => {
    const unsubscribe = 
    messaging().onMessage(async remoteMessage => {
        console.log("remoteMessage=============>",remoteMessage)
      PushNotification.createChannel(
          {
            channelId:remoteMessage.messageId.toString(),
            channelName: "Bikedoot_Partner", // (required)
            channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.

          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );

        PushNotification.localNotification({
          channelId:remoteMessage.messageId.toString(),
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          data:remoteMessage.data,
          largeIcon:"ic_notification",
          smallIcon:"ic_notification",
          playSound:true,
          color:"#FFFFFF"
          
        });

      
    });

    return unsubscribe;
  }, []);

  return null;
};

export default NotificationControllerForeground;