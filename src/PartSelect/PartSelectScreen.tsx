import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Alert} from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import {parts, ROUTES} from '../constants';
import PartBox from './PartBox';
import {Part, Parts} from '../@types/index';

type Props = NavigationStackScreenProps<{team: number, rcUsageState: number}>
type States = {
  part: Part | null
}
export default class PartSelectScreen extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      part: null
    }
    this.renderPartBoxes = this.renderPartBoxes.bind(this);
    this.moveToSpeechScreen = this.moveToSpeechScreen.bind(this);
    this.moveToRCScreen = this.moveToRCScreen.bind(this);
  }
  static navigationOptions = {
    title: '몸체 설정'
  }
  moveToSpeechScreen(part: Part) {
    let team: number = this.props.navigation.getParam('team');
    if ( team > 0 ) {
      this.props.navigation.push(ROUTES.SpeechScreen, {
        part,
        team
      });
    } else {
      Alert.alert("ERROR", "팀이 설정되어있지 않습니다.");
    }
  }
  moveToRCScreen(part: Part) {
    let team: number = this.props.navigation.getParam('team');
    if ( team > 0 ) {
      this.props.navigation.push(ROUTES.RemoteControllerScreen, {
        part,
        team
      });
    } else {
      Alert.alert("ERROR", "팀이 설정되어있지 않습니다.");
    }
  }
  renderPartBoxes(parts: Parts) {
    let rcUsageState = this.props.navigation.getParam('rcUsageState');
    let moveToControllerScreen = rcUsageState ? this.moveToRCScreen : this.moveToSpeechScreen;
    let partBoxes = []
    partBoxes.push(<PartBox key="hand" moveToControllerScreen={moveToControllerScreen} part={parts.HAND} image={require('../images/hand.png')}></PartBox>);
    partBoxes.push(<PartBox key="arm" moveToControllerScreen={moveToControllerScreen} part={parts.ARM} image={require('../images/arm.png')}></PartBox>);
    partBoxes.push(<PartBox key="waist" moveToControllerScreen={moveToControllerScreen} part={parts.WAIST} image={require('../images/waist.png')}></PartBox>);
    partBoxes.push(<PartBox key="bottom" moveToControllerScreen={moveToControllerScreen} part={parts.BOTTOM} image={require('../images/bottom.png')}></PartBox>);

    return partBoxes;
  }
  render() {
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.backgroundImage}>
        <View style={styles.container}>
          {this.renderPartBoxes(parts)}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  }
});