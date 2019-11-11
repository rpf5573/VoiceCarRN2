import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import {Locale, rapiURL} from '../constants';

type States = {
  running: boolean
}
type Props = {
  spell: string,
  active: boolean,
  team: number,
  command: string
}
export default class Spell extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.handleSpellClick = this.handleSpellClick.bind(this);
    this.sendCommand = this.sendCommand.bind(this);
    this.state = {
      running: false
    }

    let t = props.command.indexOf('/');
    let z = props.command.slice(0, t);
    this.stopCommand = `${z}/stop`;
  }
  stopCommand: string;
  render() {
    let dynamicStyle = {
      backgroundColor: this.props.active ? 'orange' : 'gray',
      opacity: this.props.active ? 1 : 0.5
    }
    if ( this.state.running ) {
      dynamicStyle.backgroundColor = 'skyblue';
    }
    return (
      <View style={[styles.spell, dynamicStyle]}>
        <TouchableWithoutFeedback onPress={() => { if ( this.props.active ) {
          this.handleSpellClick();
        }}}>
          <Text style={styles.spell_text}>{this.props.spell}</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
  handleSpellClick() {
    if ( !this.state.running ) {
      this.sendCommand(this.props.command, () => {
        this.setState({ running: true });
      });
    } else {
      this.sendCommand(this.stopCommand, () => {
        this.setState({ running: false });
      });
    }
  }
  sendCommand(command: string|undefined, callback: () => void) {
    let url: string = `${rapiURL(this.props.team)}/${command}`;
    axios(url).then((response) => {
      if ( response.status == 201 ) {
        callback();
      } else {
        alert("포크레인 서버로부터 잘못된 응답이 왔습니다");
      }
    }).catch((err) => {
      alert("포크레인 서버로부터 응답이 없습니다");
    });
  }
}
const styles = StyleSheet.create({
  spell: {
    width: '33.333%',
    aspectRatio: 1,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    opacity: 0.5
  },
  spell_text: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white'
  }
});