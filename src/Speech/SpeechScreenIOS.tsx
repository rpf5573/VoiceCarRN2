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
  speech = React.createRef<SpeechScreen>();
  constructor(props: Props) {
    super(props);
  }
  onSpeechResults = (e: Voice.Results) => {
    console.log("onSpeechResults in SpeechScreenIOS");
    const val: string = e.value[0];
    this.speech.current!.setState({
      result: val,
    });
  };
  onSpeechFinish = (speechResult: string) => {
    console.log("onSpeechFinish is called");
    this.speech.current!.setState({
      active: false
    }, () => {
      let result = this.speech.current!.getMatchedSpell(speechResult);
      if ( result.code > 0 ) {
        this.speech.current!.sendCommand(result.code, result.speed, () => {
          this.speech.current!.setState({
            active: false,
            matchedSpellCode: 0
          });
        });
      } else {
        this.speech.current!.setState({
          active: false,
        });
      }
    });
  }
  finishRecognizing = async () => {
    try {
      await Voice.cancel();
      this.speech.current!.setState({
        active: false
      }, () => {
        if ( this.speech.current!.state.result ) {
          this.onSpeechFinish(this.speech.current!.state.result);
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
    return (<SpeechScreen ref={this.speech} team={team} part={part} onSpeechResults={this.onSpeechResults} finishRecognizing={this.finishRecognizing}></SpeechScreen>);
  }
}