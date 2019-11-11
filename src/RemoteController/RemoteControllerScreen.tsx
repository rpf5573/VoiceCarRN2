import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ImageBackground,
  Dimensions
} from "react-native";
import Hexagon from "./RemoteControlBtn";
import { parts, rapiURL, RemoteBtnType } from '../constants';
import { Part, RemoteControlBtnProps } from "../@types";
import axios from "axios";
import { NavigationStackScreenProps } from 'react-navigation-stack';

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {
  activeBtnNumber: number|undefined,
  commandRightBefore: string|undefined,
  sendingCommand: boolean
};
export default class RemoteControllerScreen extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeBtnNumber: undefined,
      commandRightBefore: undefined,
      sendingCommand: false
    }
    this.elements = [
      {type: RemoteBtnType.Empty}, {type: RemoteBtnType.PlaceHoldImage} , {type: RemoteBtnType.Empty},
      {type: RemoteBtnType.Text, text: "펴"}, {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "접어"},
      {type: RemoteBtnType.Text, text: "들어"}, {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "내려"},
      {type: RemoteBtnType.Empty}, {type: RemoteBtnType.Text, text: "빠르게"}, {type: RemoteBtnType.Empty},
      {type: RemoteBtnType.Text, text: "왼쪽"}, {type: RemoteBtnType.Text, text: "앞으로"}, {type: RemoteBtnType.Text, text: "오른쪽"},
      {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "뒤로"}, {type: RemoteBtnType.PlaceHoldImage}
    ]
    if ( this.part == parts.ARM ) {
      this.elements[3].text = '팔펴'; // part.main에는 팔펴가 들어있을거거든!
      this.part.spells.forEach(part => {
        if ( this.elements[3].text == part.main ) {
          this.elements[3].code = part.code;
          this.elements[3].speed = part.speed;
        }
        else if ( this.elements[5].text == part.main ) {
          this.elements[5].code = part.code;
          this.elements[5].speed = part.speed;
        } else if ( this.elements[6].text == part.main ) {
          this.elements[6].code = part.code;
          this.elements[6].speed = part.speed;
        } else if ( this.elements[8].text == part.main ) {
          this.elements[8].code = part.code;
          this.elements[8].speed = part.speed;
        }
      });
    }
    else if ( this.part == parts.BOTTOM ) {
      this.part.spells.forEach(part => {
        // 10 = 빠르게
        if ( this.elements[10].text == part.main ) {
          this.elements[10].code = part.code;
          this.elements[10].speed = part.speed;
        }
        // 12 = 왼쪽
        else if ( this.elements[12].text == part.main ) {
          this.elements[12].code = part.code;
          this.elements[12].speed = part.speed;
        }
        // 13 = 앞으로
        else if ( this.elements[13].text == part.main ) {
          this.elements[13].code = part.code;
          this.elements[13].speed = part.speed;
        }
        // 14 = 오른쪽
        else if ( this.elements[14].text == part.main ) {
          this.elements[14].code = part.code;
          this.elements[14].speed = part.speed;
        }
        // 16 = 뒤로
        else if ( this.elements[16].text == part.main ) {
          this.elements[16].code = part.code;
          this.elements[16].speed = part.speed;
        }
      });
    } else if ( this.part == parts.HAND ) {
      this.elements[3].text = '손펴';
      this.elements[5].text = '잡아';
      this.part.spells.forEach(part => {
        if ( this.elements[3].text == part.main ) {
          this.elements[3].code = part.code;
          this.elements[3].speed = part.speed;
        }
        else if ( this.elements[5].text == part.main ) {
          this.elements[5].code = part.code;
          this.elements[5].speed = part.speed;
        }
      });
    } else if ( this.part == parts.WAIST ) {
      this.part.spells.forEach(part => {
        if ( this.elements[12].text == part.main ) {
          this.elements[12].code = part.code;
          this.elements[12].speed = part.speed;
        }
        else if ( this.elements[14].text == part.main ) {
          this.elements[14].code = part.code;
          this.elements[14].speed = part.speed;
        }
      });
    }
  }
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");
  elements: any[] = []
  sendCommand = (btnNumber:number, code: number, speed: number, isStop: boolean) => {
    var url = `${rapiURL(this.team)}/${code}/${speed}`;
    axios(url).then((response) => {
      if (response.status == 201) {
        if (response.data.error) {
          this.setState({
            activeBtnNumber: undefined,
            sendingCommand: false
          });
          // Alert.alert(response.data.error);
          return;
        }
        this.setState({
          activeBtnNumber: isStop ? undefined : btnNumber,
          sendingCommand: false
        });
      } else {
        this.setState({
          activeBtnNumber: undefined,
          sendingCommand: false
        });
        // Alert.alert("ERROR", "통신 에러");
      }
    }).catch((err) => {
      console.log('err in remote controller', err);
      this.setState({
        activeBtnNumber: undefined,
        sendingCommand: false
      });
      Alert.alert("ERROR", "배터리 방전 / 알수없는 오류");
    });
  }
  handleClickBtn = (btnNumber: number, code: number, speed: number) => {
    // 현재 명령을 보내고 있는지 체크
    if ( ! this.state.sendingCommand ) {

      // inactive상태의 버튼을 눌렀을때
      if ( this.state.activeBtnNumber != btnNumber ) {
        this.sendCommand(btnNumber, code, speed, false);
      }

      // active 상태의 버튼을 눌렀을때
      else {
        // code 에서 stop을 만들어야지!
        let stopCode = Math.floor(code/10) * 10; // 41이 들어오면 40으로 바꿔버린다!
        this.sendCommand(btnNumber, stopCode, speed, true);
      }

    }
  }
  renderBoxes = () => {
    const items = []
    for ( const [index, value] of this.elements.entries() ) {
      var isActive = false;
      if ( (index+1) == this.state.activeBtnNumber ) {
        isActive = true;
      }
      items.push(
        <View style={styles.box} key={index}>
          <Hexagon type={value.type} text={value.text} code={value.code} speed={value.speed} onPress={this.handleClickBtn} btnNumber={index+1} isActive={isActive}></Hexagon>
        </View>);
    }
    return items
  }
  render() {
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.full}>
        <View style={styles.container}>
          <Text style={styles.title}>Remote Control View</Text>
          <View style={styles.wrapper}>
            {this.renderBoxes()}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const windowRatio = Number((windowHeight/windowWidth).toFixed(2));
const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%'
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: "700",
    color: 'white',
    marginBottom: 15
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  wrapper: {
    width: (windowRatio < 1.9 ? '80%' : '90%'),
    height: '82%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center'
  },
  box: {
    width: '33.33%',
    aspectRatio: 1.2
  },
});