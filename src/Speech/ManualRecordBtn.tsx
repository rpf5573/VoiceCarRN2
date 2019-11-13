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
  backgroundColor: string,
  strokColor?: string
}
export default class ManualRecordBtn extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { onPress, style, backgroundColor, strokColor } = this.props;
    return (
      <View style={style}>
        <HaxagonView type={HaxagonViewType.Image} onPress={onPress} image={require('../images/manual-record.png')} backgroundColor={backgroundColor} strokeColor={strokColor ? strokColor : undefined}></HaxagonView>
      </View>
    );
  }
}