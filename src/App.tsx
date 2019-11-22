import React, {Component} from 'react';
import {
  Alert,
  Platform
} from 'react-native';
import { InitialAppState } from "./@types/index";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import EntranceScreen from './Entrance/EntranceScreen';
import SpeechScreenIOS from './Speech/SpeechScreenIOS';
import SpeechScreenAndroid from './Speech/SpeechScreenAndroid';
import PartSelectScreen from './PartSelect/PartSelectScreen';
import RemoteControllerScreen from './RemoteController/RemoteControllerScreen';
import {serverURL} from './constants';
import axios from "axios";
import {AxiosRequestConfig} from "axios";
import {ROUTES} from './constants';
import { useScreens } from 'react-native-screens';
useScreens();

let SpeechScreen = (Platform.OS == 'ios') ? SpeechScreenIOS : SpeechScreenAndroid;
const AppNavigator = createStackNavigator(
  {
    EntranceScreen,
    SpeechScreen,
    PartSelectScreen,
    RemoteControllerScreen,
  },
  {
    initialRouteName: ROUTES.EntranceScreen,
    headerMode: "none"
  }
);
const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return (<AppContainer></AppContainer>);
  }
}