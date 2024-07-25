/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeFirebase, setBackgroundMessageHandler, NotificationListener } from './src/utils/NotificationController';


// Initialize Firebase
initializeFirebase();

//Handle notification open
NotificationListener();

//Handle backgroung
setBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
