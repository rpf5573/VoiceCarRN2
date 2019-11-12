import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback, Alert, Image, ImageSourcePropType} from 'react-native';
import {Part} from '../@types/index';

type Props = {
  backgroundColor?: string,
  part: Part,
  moveToControllerScreen: (part: Part) => void,
  image: ImageSourcePropType,
}
export default class PartBox extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <View style={[styles.partBox, {backgroundColor: this.props.backgroundColor}]}>
        <TouchableWithoutFeedback onPress={() => { this.props.moveToControllerScreen(this.props.part) }}>
          <View style={styles.innerBox}>
            <Image style={styles.img} source={this.props.image} resizeMode="contain"></Image>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  partBox: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 50,
    color: 'white'
  },
  innerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    maxWidth: 132,
    maxHeight: '100%'
  }
});