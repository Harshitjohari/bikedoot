/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeFirebase, setBackgroundMessageHandler, NotificationListener } from './src/utils/NotificationController';
import crashlytics from '@react-native-firebase/crashlytics';


// Initialize Firebase
initializeFirebase();

//Handle notification open
NotificationListener();

//Handle backgroung
setBackgroundMessageHandler();


// Enable Crashlytics collection
crashlytics().setCrashlyticsCollectionEnabled(true).then(() => {
    console.log('Crashlytics collection enabled');
}).catch(error => {
    console.log('Failed to enable Crashlytics collection:', error);
});


AppRegistry.registerComponent(appName, () => App);
