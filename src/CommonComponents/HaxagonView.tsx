import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageURISource,
  ImageProps
} from "react-native";
import Svg, {
  Text as SVGText,
  TextPath,
  Path,
  Image,
} from 'react-native-svg';
import { HaxagonViewType } from '../constants';
type Props = {
  type: HaxagonViewType,
  text?: string,
  strokeColor?: string,
  opacity?: number,
  backgroundColor?: string,
  image?: ImageProps['source'],
  onPress?: () => void
}
type States = {}

export default class HaxagonView extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { type, text, strokeColor, opacity, backgroundColor, image, onPress } = this.props;
    return (
      <Svg width="100%" height="100%" viewBox="0 0 120 100" onPress={onPress ? onPress : undefined}>
        <Path
          d="M 32.9,3 C 3,50.5 3,51.56 3,51.56 L 32.9,98 90.4,98 118,51.56 90.4,3 32.9,3 Z M 32.9,3"
          fill={(backgroundColor ? backgroundColor : 'transparent')}
          stroke={strokeColor ? strokeColor : 'gold'}
          strokeWidth="5"
          strokeLinecap="round">
        </Path>
        { (type == HaxagonViewType.Text) &&
          <SVGText
            fontFamily="Helvetica"
            fontWeight="bold"
            fontSize="32"
            textAnchor="middle"
            x="60"
            y="53"
            opacity={opacity ? opacity : 1.0}
            alignmentBaseline="central"
            fill="white">
            {text!}
          </SVGText>
        }
        {
          (type == HaxagonViewType.Image) && 
          <Image
            width="70%"
            height="70%"
            x="20"
            y="12"
            preserveAspectRatio="xMidYMid slice"
            opacity="1.0"
            href={image}
            clipPath="url(#clip)"
          />
        }
      </Svg>
    )
  }
}