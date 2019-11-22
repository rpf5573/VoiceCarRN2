import React, { Component } from "react";
import SpeechScreen from './SpeechScreen';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  Dimensions,
  Button,
  TextInput,
} from "react-native";
import {Locale, rapiURL, parts, SpeechSpellMenuButtonType, serverURL} from '../constants';
import Voice from "react-native-voice";
import SpeechSpellMenuButton from "./SpeechSpellMenuButton";
import axios from "axios";
import { Part, Spell } from "../@types/index";
import RecordBtn from './RecordBtn';
import StopBtn from './StopBtn';
import ManualRecordBtn from './ManualRecordBtn';
import Modal from "react-native-modal";
import {AxiosRequestConfig} from "axios";
import { NavigationStackScreenProps } from 'react-navigation-stack';

type Props = NavigationStackScreenProps<{team: number, part: Part}>
export default class SpeechScreenAndroid extends SpeechScreen {
  constructor(props: Props) {
    super({
      team: props.navigation.getParam("team"),
      part: props.navigation.getParam("part")
    });
  }
  onSpeechResults = (e: Voice.Results) => {
    const val: string = e.value[0];
    this.setState({
      result: val,
    });
  };
  onSpeechFinish = (result: string) => {
    this.setState({
      active: false
    }, () => {
      let result = this.getMatchedSpell(this.state.result);
      if ( result.code > 0 ) {
        this.sendCommand(result.code, result.speed, () => {
          this.setState({
            active: false,
            matchedSpellCode: 0
          });
        });
      } else {
        this.setState({
          active: false,
        });
      }
    });
  }
  stopRecognizing = async () => {
    console.log("cancelRecognizing");
    try {
      await Voice.cancel();
      if ( this.state.result ) {
        this.onSpeechFinish(this.state.result);
      }
    } catch (e) {
      console.log('error in cancelREcogizing');
      console.error(e);
    }
  };
}