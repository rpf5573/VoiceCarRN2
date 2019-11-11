import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from "react-native";
import { RemoteBtnType, HaxagonViewType } from '../constants';
import { RemoteControlBtnProps } from "../@types/index";
import HaxagonView from '../CommonComponents/HaxagonView';

type States = {}
export default class RemoteControlBtn extends Component<RemoteControlBtnProps, States> {
  constructor(props: RemoteControlBtnProps) {
    super(props);
  }
  render() {
    const { type, text, code, isActive, onPress, btnNumber, speed } = this.props;
    if ( type == RemoteBtnType.Empty ) {
      return (<View style={styles.empty}></View>)
    }
    if ( type == RemoteBtnType.Text ) {
      var opacity = 1.0;
      if ( ! code ) {
        opacity = 0.3;
      }
      var strokeColor = "gold";
      if ( isActive ) {
        strokeColor = "blue";
      }
      return (
        <HaxagonView type={HaxagonViewType.Text} opacity={opacity} strokeColor={strokeColor} text={text} 
          onPress={() => { if ( code && speed ) { onPress(btnNumber, code, speed) } }}>
        </HaxagonView>
      )
    }
    if ( type == RemoteBtnType.PlaceHoldImage ) {
      return (
        <HaxagonView type={HaxagonViewType.Image} image={require('../images/core.png')}></HaxagonView>
      )
    }
  }
}

const styles = StyleSheet.create({
  empty: {
    width: '100%',
    height: '100%'
  }
})