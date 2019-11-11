import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from "react-native";
import Svg, {
  Text as SVGText,
  TextPath,
  Path,
  Image
} from 'react-native-svg';
import { SpeechSpellMenuItemType } from '../constants';
type Props = {
  type: SpeechSpellMenuItemType,
  word?: string,
  strokeColor?: string,
  opacity?: number,
}
type States = {}

export default class HaxagonBtn extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    if ( this.props.type == SpeechSpellMenuItemType.Empty ) {
      return (<View style={styles.empty}></View>)
    }
    if ( this.props.type == SpeechSpellMenuItemType.Text ) {
      return (
        <Svg width="100%" height="100%" viewBox="0 0 120 100">
          <Path
            d="M 32.9,3 C 3,50.5 3,51.56 3,51.56 L 32.9,98 90.4,98 118,51.56 90.4,3 32.9,3 Z M 32.9,3"
            fill="none"
            stroke={this.props.strokeColor ? this.props.strokeColor : 'gold'}
            strokeWidth="5"
            strokeLinecap="round">
          </Path>
          <SVGText
            fontFamily="Helvetica"
            fontWeight="bold"
            fontSize="32"
            textAnchor="middle"
            x="60"
            y="53"
            opacity={this.props.opacity ? this.props.opacity : 1.0}
            alignmentBaseline="central"
            fill="white">
            {this.props.word!}
          </SVGText>
        </Svg>
      )
    }
  }
}

const styles = StyleSheet.create({
  empty: {
    width: '100%',
    height: '100%'
  }
});