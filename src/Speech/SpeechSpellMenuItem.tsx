import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from "react-native";
import { SpeechSpellMenuItemType, HaxagonViewType } from '../constants';
import HaxagonView from '../CommonComponents/HaxagonView';
type Props = {
  type: SpeechSpellMenuItemType,
  word?: string,
  strokeColor?: string,
  opacity?: number,
}
type States = {}

export default class SpeechSpellMenuItem extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { type, word, strokeColor, opacity } = this.props;
    if ( this.props.type == SpeechSpellMenuItemType.Empty ) {
      return (<View style={styles.empty}></View>)
    }
    if ( type == SpeechSpellMenuItemType.Text ) {
      return (
        <HaxagonView type={HaxagonViewType.Text} text={word} strokeColor={strokeColor} opacity={opacity}></HaxagonView>
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