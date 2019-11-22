import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ImageBackground,
  Dimensions,
  Button
} from "react-native";
import RemoteControlBtn from "./RemoteControlBtn";
import { parts, rapiURL, RemoteBtnType, serverURL } from '../constants';
import { Part, RemoteControlBtnProps } from "../@types";
import { AxiosRequestConfig } from "axios";
import axios from "axios";
import { NavigationStackScreenProps } from 'react-navigation-stack';
import Modal from "react-native-modal";
import { TextInput } from 'react-native-gesture-handler';
import { number } from 'prop-types';

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {
  activeBtnNumber: number|undefined,
  commandRightBefore: string|undefined,
  sendingCommand: boolean,
  isSpeedInputMode: boolean,
  selectedWord: string,
  selectedWordCol: string,
  isSpeedEditModalVisible: boolean,
  speed: number
};
export default class RemoteControllerScreen extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeBtnNumber: undefined,
      commandRightBefore: undefined,
      sendingCommand: false,
      isSpeedInputMode: false,
      isSpeedEditModalVisible: false,
      selectedWord: '',
      selectedWordCol: '',
      speed: 0
    }
  }
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");
  elements: any[] = [
    {type: RemoteBtnType.Empty}, {type: RemoteBtnType.SpeedInputButton} , {type: RemoteBtnType.Empty},
    {type: RemoteBtnType.Text, text: "펴"}, {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "접어"},
    {type: RemoteBtnType.Text, text: "들어"}, {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "내려"},
    {type: RemoteBtnType.Empty}, {type: RemoteBtnType.Text, text: "빠르게"}, {type: RemoteBtnType.Empty},
    {type: RemoteBtnType.Text, text: "왼쪽"}, {type: RemoteBtnType.Text, text: "앞으로"}, {type: RemoteBtnType.Text, text: "오른쪽"},
    {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "뒤로"}, {type: RemoteBtnType.PlaceHoldImage}
  ]
  setElements = () => {
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
    } else if ( this.part == parts.BOTTOM ) {
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
  sendCommand = (btnNumber:number, code: number, speed: number, isStop: boolean) => {
    var url = `${rapiURL(this.team)}/${code}/${speed}`;
    console.log("url", url);
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
  handleClickSpeedEditButton = () => {
    this.toggleSpeedInputMode();
  }
  handleClickBtn = (type: RemoteBtnType, text: string, btnNumber: number, code: number, speed: number) => {
    const {isSpeedInputMode, sendingCommand, activeBtnNumber} = this.state;

    if ( isSpeedInputMode ) {
      return this.setState({
        selectedWord: text,
        selectedWordCol: this.findColFromWord(text),
        isSpeedEditModalVisible: true
      });
    }

    console.log("code : ", code);
    console.log("speed : ", speed);

    // 현재 명령을 보내고 있는지 체크
    if ( ! sendingCommand ) {
      // inactive상태의 버튼을 눌렀을때
      if ( activeBtnNumber != btnNumber ) {
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
  toggleSpeedInputMode = () => {
    this.setState({
      isSpeedInputMode: !this.state.isSpeedInputMode,
      selectedWord: '',
      speed: 0
    });
  }
  closeSpeedEditModal = () => {
    const { isSpeedEditModalVisible } = this.state;
    if ( isSpeedEditModalVisible ) {
      this.setState({
        isSpeedEditModalVisible: false,
        selectedWord: '',
        speed: 0
      });
    }
  }
  saveSpeed = async () => {
    const { selectedWordCol: col, selectedWord, speed } = this.state;
    if ( !speed ) { return Alert.alert("ERROR", "속도값을 입력해주세요"); }
    if ( speed < 1 || speed > 100 ) { return Alert.alert("ERROR", "속도값은 1 이상 100이하 여야만 합니다"); }

    // server에 먼저 업로드
    const team = this.team;
    if ( !col ) { return Alert.alert("ERROR", "다시 시도해주세요(col is undefined)"); }

    try {
      let response = await this.uploadSpeedToServer(team, col, speed);
      if ( response.status == 201 ) {
        if ( response.data.error ) { return Alert.alert("ERROR", response.data.error); }
      }
      this.updateSpeedToLocal(speed);
      Alert.alert('', `[${selectedWord}]의 속도값을 ${speed}로 변경했습니다`, [
        {text: 'OK', onPress: this.closeSpeedEditModal },
      ]);
    } catch (err) {
      console.log("err : ", err);
    }
  }
  uploadSpeedToServer = async (team:number, col: string, speed: number) => {
    let config: AxiosRequestConfig = {
      method: 'POST',
      url: `${serverURL}/speeds/insertPartColSpeed`,
      data: {
        col,
        team,
        speed
      }
    }
    return axios(config);
  }
  updateSpeedToLocal = async (speed: number) => {
    const { selectedWord } = this.state;
    if ( ! selectedWord ) {
      console.log("NO SELECTED WORD");
      return false;
    }
    this.part.spells.forEach(spell => {
      if ( spell.main == selectedWord ) {
        console.log("요기서 변경해보리기!");
        spell.speed = speed
      }
    });
  }
  findColFromWord = (word: string) : string => {
    let col = '';
    this.part.spells.forEach(spell => {
      if ( spell.main == word ) {
        col = spell.col;
      }
    });
    return col;
  }
  findSpeedFromWord = (word: string) : number => {
    let speed = 0;
    this.part.spells.forEach(spell => {
      if ( spell.main == word ) {
        speed = spell.speed;
      }
    });
    return speed;
  }
  
  renderBoxes = () => {
    const { activeBtnNumber, selectedWord, isSpeedInputMode } = this.state;
    const items = []
    for ( const [index, value] of this.elements.entries() ) {
      var strokeColor = 'gold';
      if ( isSpeedInputMode ) {
        // value.code가 있다는것은 이 파트에 해당하는 명령어들만 aqua로 바꾼다는 의미이다
        if ( value.type == RemoteBtnType.Text && value.code ) {
          strokeColor = 'aqua';
        }
      } else {
        if ( (index+1) == activeBtnNumber ) {
          strokeColor = 'blue';
        }
      }
      items.push(
        <View style={styles.box} key={index}>
          <RemoteControlBtn type={value.type} text={value.text} code={value.code} speed={value.speed} onPress={ value.type == RemoteBtnType.SpeedInputButton ? this.handleClickSpeedEditButton : this.handleClickBtn} btnNumber={index+1} strokeColor={strokeColor}></RemoteControlBtn>
        </View>
      );
    }
    return items;
  }
  render() {
    // 이렇게 해야 speed를 변경했을때 그 변경한것들이 반영된다.
    // 왜냐면 주소값을 넘겨주는게 아니라 speed라는 값을 넘기기 때문에 반영이 안된다
    this.setElements();
    const { isSpeedEditModalVisible, selectedWord } = this.state;
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.full}>
        <View style={styles.container}>
          <Text style={styles.title}>Remote Control View</Text>
          <View style={styles.wrapper}>
            {this.renderBoxes()}
          </View>
        </View>
        <Modal isVisible={isSpeedEditModalVisible} onBackdropPress={this.closeSpeedEditModal} style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <Text style={[styles.textMiddle,styles.modalInnerText]}>
              <Text style={styles.selectedWord}>[{selectedWord}]</Text>
              <Text>명령어의{"\n"} 속도값을 입력해주세요</Text>
            </Text>
            <TextInput style={styles.speedEditInput} keyboardType={'numeric'}
              onChangeText={text => { 
                var numberChecker = /^\d+$/;
                if ( numberChecker.test(text) ) {
                  this.setState({speed: parseInt(text)})
                } else {
                  // 숫자말고 다른값을 입력하면 아예 그냥 속도를 0으로 만들어 버리기!
                  this.setState({speed: 0})
                }
              }} placeholder={ selectedWord ? `현재 : ${this.findSpeedFromWord(selectedWord)}` : ''}></TextInput>
            <View style={{margin:10}}></View>
            <Button title="확인" onPress={this.saveSpeed}/>
          </View>
        </Modal>
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
  modalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%'
  },
  modalInner: {
    width: '70%',
    backgroundColor: 'white',
    padding: 20
  },
  modalInnerText: {
    fontSize: 20,
    marginBottom: 20
  },
  textMiddle: {
    textAlign: 'center'
  },
  speedEditInput: {
    minHeight: 45,
    width: '100%',
    fontSize: 20,
    padding: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#222',
    borderRadius: 10
  },
  selectedWord: {
    color: 'blue'
  }
});