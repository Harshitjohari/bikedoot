/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeFirebase, getToken, setBackgroundMessageHandler, onMessage } from './src/utils/NotificationController';


// Initialize Firebase
initializeFirebase();

// Set background message handler
setBackgroundMessageHandler();

// Listen for foreground messages
onMessage();

// getToken();

AppRegistry.registerComponent(appName, () => App);
