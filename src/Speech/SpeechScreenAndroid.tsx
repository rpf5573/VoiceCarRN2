import React, { Component } from "react";
import SpeechScreen from './SpeechScreen';
import Voice from "react-native-voice";
import { Part } from "../@types/index";
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { Alert } from "react-native";

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {};
export default class SpeechScreenAndroid extends Component<Props,States> {
  speech = React.createRef<SpeechScreen>();
  constructor(props: Props) {
    super(props);
  }
  processSpeechResult = (speechResult: string) => {
    console.log("processSpeechResult is called");
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
  }
  onSpeechResults = (e: Voice.Results) => {
    console.log("onSpeechResults in SpeechScreenAndroid");
    const val: string = e.value[0];
    if ( val ) {
      this.speech.current!.setState({
        result: val,
      }, () => {
        this.processSpeechResult(this.speech.current!.state.result);
      });
    }
  };
  finishRecognizing = async () => {
    try {
      await Voice.cancel();
      this.speech.current!.setState({
        ...this.speech.current!.defaultState
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