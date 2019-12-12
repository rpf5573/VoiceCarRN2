import React, { Component } from "react";
import SpeechScreen from './SpeechScreen';
import Voice from "react-native-voice";
import { Part } from "../@types/index";
import { NavigationStackScreenProps } from 'react-navigation-stack';

type Props = NavigationStackScreenProps<{part: Part}>
type States = {};
export default class SpeechScreenIOS extends Component<Props,States> {
  speech = React.createRef<SpeechScreen>();
  constructor(props: Props) {
    super(props);
  }
  processSpeechResult = (speechResult: string) => {
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
    const val: string = e.value[0];
    this.speech.current!.setState({
      result: val,
    });
  };
  onSpeechFinish = (speechResult: string) => {
    this.speech.current!.setState({
      active: false
    }, () => {
      this.processSpeechResult(speechResult);
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
    let part = this.props.navigation.getParam("part");
    return (<SpeechScreen ref={this.speech} part={part} onSpeechResults={this.onSpeechResults} finishRecognizing={this.finishRecognizing}></SpeechScreen>);
  }
}