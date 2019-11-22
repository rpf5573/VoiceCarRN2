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
import { Part, Spell, ISpeechScreen } from "../@types/index";
import RecordBtn from './RecordBtn';
import StopBtn from './StopBtn';
import ManualRecordBtn from './ManualRecordBtn';
import Modal from "react-native-modal";
import {AxiosRequestConfig} from "axios";
import { NavigationStackScreenProps } from 'react-navigation-stack';

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {};
export default class SpeechScreenIOS extends Component<Props,States> {
  constructor(props: Props) {
    super(props);
  }
  onSpeechResults(e: Voice.Results) {
    const that : SpeechScreen = (this as any) as SpeechScreen;
    console.log("onSpeechResults in SpeechScreenIOS");
    const val: string = e.value[0];
    that.setState({
      result: val,
    });
  };
  onSpeechFinish(speechResult: string) {
    const that : SpeechScreen = (this as any) as SpeechScreen;
    that.setState({
      active: false
    }, () => {
      let result = that.getMatchedSpell(speechResult);
      if ( result.code > 0 ) {
        that.sendCommand(result.code, result.speed, () => {
          that.setState({
            active: false,
            matchedSpellCode: 0
          });
        });
      } else {
        that.setState({
          active: false,
        });
      }
    });
  }
  async finishRecognizing() {
    const that : SpeechScreen = (this as any) as SpeechScreen;
    try {
      await Voice.cancel();
      that.setState({
        active: false
      }, () => {
        if ( that.state.result ) {
          that.onSpeechFinish(that.state.result);
        }
      });
    } catch (e) {
      console.log('error in cancelREcogizing');
      console.error(e);
    }
  };
  render() {
    let team = this.props.navigation.getParam("team");
    let part = this.props.navigation.getParam("part");
    return (<SpeechScreen team={team} part={part} onSpeechResults={this.onSpeechResults} finishRecognizing={this.finishRecognizing}></SpeechScreen>);
  }
}