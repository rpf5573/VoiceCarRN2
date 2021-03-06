import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Alert} from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import {parts, ROUTES} from '../constants';
import PartBox from './PartBox';
import {Part, Parts} from '../@types/index';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { AxiosRequestConfig } from 'axios';

type Props = NavigationStackScreenProps<{}>
type States = {
  part: Part | null,
  isSpinnerVisible: boolean
}
export default class PartSelectScreen extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      part: null,
      isSpinnerVisible: false
    }
  }
  static navigationOptions = {
    title: '몸체 설정'
  }
  toggleSpinner = () => { this.setState({isSpinnerVisible: !this.state.isSpinnerVisible}); }
  moveToSpeechScreen = (part: Part) => {
    if ( global.team > 0 ) {
      this.props.navigation.push(ROUTES.SpeechScreen, { part });
    } else {
      Alert.alert("ERROR", "팀이 설정되어있지 않습니다.");
    }
  }
  moveToRCScreen = (part: Part) => {
    if ( global.team > 0 ) {
      this.props.navigation.push(ROUTES.RemoteControllerScreen, { part });
    } else {
      Alert.alert("ERROR", "팀이 설정되어있지 않습니다.");
    }
  }
  moveToControllerScreen = async (part: Part) => {
    this.toggleSpinner();
    console.log("global.rcUsageState", global.rcUsageState);
    if ( global.rcUsageState ) {
      this.getPartSpeeds(part, () => {
        this.toggleSpinner();
        this.moveToRCScreen(part);
      });
    } else {
      this.getPartSpeeds(part, () => {
        this.getPartWords(part, () => {
          this.toggleSpinner();
          this.moveToSpeechScreen(part);
        });
      });
    }
  }
  getPartWords = (part: Part, callback: () => void ) => {
    const team = global.team;
    let config : AxiosRequestConfig = {
      method: 'POST',
      url: `${global.serverURL()}/words/getPartWords`,
      data: {
        team,
        partCols: part.spells.map((spell) => {return spell.col})
      }
    };
    console.log(config);
    axios(config).then((res) => {
      if ( res.status == 201 ) {
        if ( res.data.error ) {
          return Alert.alert("ERROR", res.data.error);
        }
        const words = res.data.words;
        // 이렇게 하긴 했는데, 조심해야되. 이거 주소값으로 설정한거니까!
        for ( var i = 0; i < part.spells.length; i++ ) {
          const key = part.spells[i].col;
          part.spells[i].similar = words[key];
        }
        callback();
      } else {
        return Alert.alert("ERROR", "서버로부터 잘못된 응답을 받았습니다");
      }
    }).catch((err) => {
      this.toggleSpinner();
      console.error(err);
      return Alert.alert("ERROR", "알수없는에러 발생");
    });
  }
  getPartSpeeds = (part: Part, callback: () => void ) => {
    const team = global.team;
    let config : AxiosRequestConfig = {
      method: 'POST',
      url: `${global.serverURL()}/speeds/getPartSpeeds`,
      data: {
        team,
        partCols: part.spells.map((spell) => {return spell.col})
      }
    };
    axios(config).then((res) => {
      if ( res.status == 201 ) {
        if ( res.data.error ) {
          return Alert.alert("ERROR", res.data.error);
        }
        const speeds = res.data.speeds;
        // 이렇게 하긴 했는데, 조심해야되. 이거 주소값으로 설정한거니까!
        for ( var i = 0; i < part.spells.length; i++ ) {
          const key = part.spells[i].col;
          part.spells[i].speed = speeds[key];
        }
        callback();
      } else {
        return Alert.alert("ERROR", "서버로부터 잘못된 응답을 받았습니다");
      }
    }).catch((err) => {
      this.toggleSpinner();
      console.error(err);
      return Alert.alert("ERROR", "알수없는에러 발생");
    });
  } 
  renderPartBoxes = (parts: Parts) => {
    let rcUsageState = global.rcUsageState;
    let partBoxes = []
    partBoxes.push(<PartBox key="hand" moveToControllerScreen={this.moveToControllerScreen} part={parts.HAND} image={require('../images/hand.png')}></PartBox>);
    partBoxes.push(<PartBox key="arm" moveToControllerScreen={this.moveToControllerScreen} part={parts.ARM} image={require('../images/arm.png')}></PartBox>);
    partBoxes.push(<PartBox key="waist" moveToControllerScreen={this.moveToControllerScreen} part={parts.WAIST} image={require('../images/waist.png')}></PartBox>);
    partBoxes.push(<PartBox key="bottom" moveToControllerScreen={this.moveToControllerScreen} part={parts.BOTTOM} image={require('../images/bottom.png')}></PartBox>);

    return partBoxes;
  }
  render() {
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.backgroundImage}>
        <Spinner
          visible={this.state.isSpinnerVisible}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
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
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});