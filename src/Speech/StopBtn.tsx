import React, { Component } from 'react';
import {
  StyleProp,
  ViewStyle,
  ImageProps,
  View
} from "react-native";
import { HaxagonViewType } from '../constants';
import HaxagonView from '../CommonComponents/HaxagonView';

type States = {}
type Props = {
  onPress: () => void,
  style?: StyleProp<ViewStyle>,
  backgroundColor: string
}
export default class StopBtn extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { onPress, style, backgroundColor } = this.props;
    return (
      <View style={style}>
        <HaxagonView type={HaxagonViewType.Image} onPress={onPress} image={require('../images/stop.png')} backgroundColor={backgroundColor}></HaxagonView>
      </View>
    );
  }
}