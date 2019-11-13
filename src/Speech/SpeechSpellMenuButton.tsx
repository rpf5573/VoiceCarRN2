import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from "react-native";
import { SpeechSpellMenuButtonType, HaxagonViewType } from '../constants';
import HaxagonView from '../CommonComponents/HaxagonView';
import { Spell } from '../@types/index';
type Props = {
  type: SpeechSpellMenuButtonType,
  word?: string,
  strokeColor?: string,
  opacity?: number,
  onClick: (word: string) => void
}
type States = {}

export default class SpeechSpellMenuButton extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { type, word, strokeColor, opacity, onClick } = this.props;
    if ( this.props.type == SpeechSpellMenuButtonType.Empty ) {
      return (<View style={styles.empty}></View>)
    }
    if ( type == SpeechSpellMenuButtonType.Text ) {
      return (
        <HaxagonView type={HaxagonViewType.Text} text={word} strokeColor={strokeColor} opacity={opacity} onPress={() => { onClick(word!); }}></HaxagonView>
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