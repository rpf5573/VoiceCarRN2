import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground,
  Dimensions,
  Button,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import {Locale, rapiURL, parts, SpeechSpellMenuButtonType, serverURL} from '../constants';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import Voice from "react-native-voice";
import SpeechSpellMenuButton from "./SpeechSpellMenuButton";
import axios from "axios";
import { Part, Spell } from "../@types/index";
import RecordBtn from './RecordBtn';
import HaxagonBtn from "./HaxagonBtn";
import StopBtn from './StopBtn';
import ManualRecordBtn from './ManualRecordBtn';
import Modal from "react-native-modal";
import {AxiosRequestConfig} from "axios";

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {
  active: boolean;
  error: string;
  result: string;
  partialResults: string[];
  matchedSpellCode: number;
  isManualRecordModalVisible: boolean;
  manualWord: string;
  selectedWord: string;
  selectedWordCol: string;
};
export default class SpeechScreen extends Component<Props,States> {
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");
  state = {
    active: false,
    error: "",
    result: "",
    partialResults: [],
    matchedSpellCode: 0,
    isManualRecordModalVisible: false,
    manualWord: '',
    selectedWord: '',
    selectedWordCol: ''
  };
  static navigationOptions = {
    title: "음성인식"
  };
  elements: any[] = []

  constructor(props: Props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    this.sendCommand = this.sendCommand.bind(this);
    this.getMatchedSpell = this.getMatchedSpell.bind(this);

    let spells = this.part.spells
    this.elements = [
      {type: SpeechSpellMenuButtonType.Empty}, {type: SpeechSpellMenuButtonType.Empty} , {type: SpeechSpellMenuButtonType.Empty},
      {type: SpeechSpellMenuButtonType.Empty}, {type: SpeechSpellMenuButtonType.Empty}, {type: SpeechSpellMenuButtonType.Empty},
    ]
    if ( this.part == parts.ARM ) {
      Object.assign(this.elements[0], {type: SpeechSpellMenuButtonType.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[2], {type: SpeechSpellMenuButtonType.Text, word: spells[1].main, code: spells[1].code});
      Object.assign(this.elements[3], {type: SpeechSpellMenuButtonType.Text, word: spells[2].main, code: spells[2].code});
      Object.assign(this.elements[5], {type: SpeechSpellMenuButtonType.Text, word: spells[3].main, code: spells[3].code});
    }
    else if ( this.part == parts.BOTTOM ) {
      Object.assign(this.elements[0], {type: SpeechSpellMenuButtonType.Text, word: spells[2].main, code: spells[2].code});
      Object.assign(this.elements[1], {type: SpeechSpellMenuButtonType.Text, word: spells[4].main, code: spells[4].code});
      Object.assign(this.elements[2], {type: SpeechSpellMenuButtonType.Text, word: spells[3].main, code: spells[3].code});
      Object.assign(this.elements[3], {type: SpeechSpellMenuButtonType.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[5], {type: SpeechSpellMenuButtonType.Text, word: spells[1].main, code: spells[1].code});
    }
    else if ( this.part == parts.HAND ) {
      Object.assign(this.elements[0], {type: SpeechSpellMenuButtonType.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[2], {type: SpeechSpellMenuButtonType.Text, word: spells[1].main, code: spells[1].code});
    }
    else if ( this.part == parts.WAIST ) {
      Object.assign(this.elements[0], {type: SpeechSpellMenuButtonType.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[2], {type: SpeechSpellMenuButtonType.Text, word: spells[1].main, code: spells[1].code});
    }
  }

  // render
  render() {
    const weakRed = '#E74C3C';
    let recordBtn = (
      <RecordBtn onPress={this.startRecognizing} style={styles.haxagonBtn} backgroundColor={weakRed}></RecordBtn>
    );
    if (this.state.active) {
      recordBtn = (
        <RecordBtn onPress={(Platform.OS == 'ios' ? this.cancelRecognizing : this.stopRecognizing)} style={styles.haxagonBtn} backgroundColor='blue'></RecordBtn>
      );
    }
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.full}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Text style={styles.title}>Voice Control View</Text>
            <View style={styles.spellMenuContainer}>
              {this.renderSpellMenuItems(this.elements)}
            </View>
          </View>
          <View style={styles.middle}>
            <View style={styles.resultTextContainer}>
              <View style={styles.resultOverlay}></View>
              <Text style={styles.resultText}>{this.state.result}</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            {recordBtn}
            <StopBtn style={styles.haxagonBtn} backgroundColor='red' onPress={this.stop}></StopBtn>
            <ManualRecordBtn style={styles.haxagonBtn} backgroundColor={weakRed} onPress={this.toggleManualRecordModal} strokColor={this.state.selectedWord ? 'aqua' : undefined}></ManualRecordBtn>
          </View>
        </View>
        <Modal isVisible={this.state.isManualRecordModalVisible} onBackdropPress={this.toggleManualRecordModal} style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <Text style={[styles.textMiddle,styles.modalInnerText]}>
              <Text style={styles.selectedWord}>[{this.state.selectedWord}]</Text>
              <Text>에 해당하는{"\n"} 유사명령어를 입력해주세요</Text>
            </Text>
            <TextInput placeholder={"음성 기록"} style={styles.manualWordInput} onChangeText={text => {this.setState({manualWord: text})}}></TextInput>
            <Button title="확인" onPress={this.saveSimilarWord}/>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
  renderSpellMenuItems = (elements: any[]) => {
    let spellMenuItmes: JSX.Element[] = [];
    for ( const [index, el] of elements.entries() ) {
      let isMatched = false;
      if ( this.state.matchedSpellCode == el.code) {
        isMatched = true;
      }
      let isSelected = false;
      if ( this.state.selectedWord == el.word ) {
        isSelected = true;
      }
      spellMenuItmes.push(
        <View key={index} style={styles.spellMenuItemWrapper}>
          <SpeechSpellMenuButton type={el.type} strokeColor={isSelected ? "aqua" : (isMatched ? "blue" : "gold")} word={el.word} onClick={this.onSpellMenuButtonClicked}/>
        </View>
      )
    }
    return spellMenuItmes;
  }

  // custom function
  sendCommand = (code: number, speed: number, callback: () => void) => {
    callback();
    let url: string = `${rapiURL(this.team)}/${code}/${speed}`;
    console.log('url in sendCommand', url);
    axios(url).then((response) => {
      if ( response.status == 201 ) {
      } else {
      }
    }).catch((err) => {
      Alert.alert("ERROR", "통신에러");
    });
  }
  getMatchedSpell = (spellWord: string): { code: number, speed: number } => {
    let matchedSpellCode = 0;
    let speed = 0;
    spellWord = spellWord.replace(/\s/g, "");
    this.part.spells.some((i: Spell) => {
      // 관리자가 초기값을 null로 설정하면 값이 없을수도 있응께
      if ( ! i.similar || ! Array.isArray(i.similar) ) { return false; }
      i.similar.forEach((z: string) => {
        if (z == spellWord) {
          matchedSpellCode = i.code;
          speed = i.speed;
        }
      });
    });
    return {
      code: matchedSpellCode,
      speed: speed
    }
  }

  // life cycle
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onCancelRecognition = () => {
    if ( Platform.OS != 'ios' ) { return }
    this.setState({
      active: false
    }, () => {
      let result = this.getMatchedSpell(this.state.result);
      console.log("result - onCancelRecognition", result);
      if ( result.code > 0 ) {
        this.sendCommand(result.code, result.speed, () => {
          this.setState({
            active: false,
            matchedSpellCode: 0
          });
        });
      } else {
        console.log('nothing matched');
        this.setState({
          active: false,
        });
      }
    });
  }

  // voice recognition functions
  onSpeechStart = (e: Voice.StartEvent) => {
    // eslint-disable-next-line
    console.log("onSpeechStart: ", e)
  };

  onSpeechEnd = (e: Voice.EndEvent) => {
    console.log("onSpeechEnd");
    this.setState({
      active: false
    });
  }

  onSpeechError = (e: Voice.ErrorEvent) => {
    console.log(e);
    this.setState({
      error: JSON.stringify(e.error),
      active: false
    });
  };

  onSpeechResults = (e: Voice.Results) => {
    console.log('onSpeechResults');
    const val: string = e.value[0];
    console.log(val);
    this.setState({
      result: val,
    }, () => {
      // 안드로이드만 onSpeechResults에서 서버로 명령을 보낸다
      // 왜냐하면, 안드로이드는 지가 알아서 음성인식이 꺼지기 때문이다
      if ( Platform.OS != 'android' ) { return false }
      let result = this.getMatchedSpell(this.state.result);
      console.log("result", result);
      if ( result.code > 0 ) {
        this.sendCommand(result.code, result.speed, () => {
          this.setState({
            active: false,
            matchedSpellCode: 0
          });
        });
      } else {
        console.log('nothing matched');
        this.setState({
          active: false,
        });
      }
    });
  };
  startRecognizing = async () => {
    this.setState({
      active: true,
      error: "",
      result: '',
      partialResults: [],
      matchedSpellCode: 0
    });
    try {
      await Voice.start(Locale.ko_KR);
    } catch (e) {
      console.error(e);
    }
  };
  stopRecognizing = async () => {
    console.log("stopRecognizing is called");
    try {
      await Voice.stop();
      console.log('after Voice Stop');
    } catch (e) {
      console.error(e);
    }
  };
  cancelRecognizing = async () => {
    console.log("cancelRecognizing");
    try {
      await Voice.cancel();
      this.onCancelRecognition();
    } catch (e) {
      console.log('error in cancelREcogizing');
      console.error(e);
    }
  };
  destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      error: "",
      result: '',
      partialResults: []
    });
  };

  stop = () => {
    this.stopRecognizing();
    this.sendCommand(this.part.stop.code, 10, () => {
      this.setState({
        active: false,
        result: '',
        matchedSpellCode: 0
      });
    })
  }
  toggleManualRecordModal = () => {
    if ( ! this.state.selectedWord ) { return Alert.alert("ERROR", "명령어를 먼저 선택해주세요"); }
    const col = this.findColFromWord(this.state.selectedWord);
    if ( !col ) { return Alert.alert("ERROR", "단어 컬럼이 없습니다"); }
    // 모달 닫으면 초기화 시켜줘야징
    this.setState({
      selectedWordCol: col,
      isManualRecordModalVisible: !this.state.isManualRecordModalVisible
    }, () => {
      if ( ! this.state.isManualRecordModalVisible ) { this.resetSelectedWord(200); }
    });
  }
  onSpellMenuButtonClicked = (word: string) => {
    if ( this.state.selectedWord == word ) {
      return this.resetSelectedWord();
    }
    this.setState({selectedWord: word});
  }
  findColFromWord = (word: string) : string => {
    let col = '';
    this.part.spells.forEach(spell => {
      console.log(spell.main, word);
      if ( spell.main == word ) {
        col = spell.col;
      }
    });
    return col;
  }
  resetSelectedWord = (after?: number) => {
    if ( after && after > 0 ) {
      setTimeout(() => {
        this.setState({
          selectedWord: '',
          selectedWordCol: ''
        });
      }, after);
    } else {
      this.setState({
        selectedWord: '',
        selectedWordCol: ''
      });
    }
  }
  saveSimilarWord = async () => {
    // server에 먼저 업로드
    const team = this.team;
    let {selectedWordCol: col, manualWord: similarWord} = this.state;
    if ( !col || !similarWord ) { return Alert.alert("ERROR", "다시 시도해주세요(col & similarWord is undefined)"); }

    // 스페이스 바를 제거하고나서 서버에 업로드를 하던지 해야한다.
    similarWord = similarWord.replace(/\s/g, "");
    // 한글하고 영어만 받는다잉
    const pattern_ko_en = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$/
    if ( ! pattern_ko_en.test(similarWord) ) {
      return Alert.alert("ERROR", "한글/영어만 입력 가능합니다");
    }

    try {
      let response = await this.uploadSimilarWordToServer(team, col, similarWord);
      if ( response.status == 201 ) {
        if ( response.data.error ) { return Alert.alert("ERROR", response.data.error); }
      }
      if ( response.data.updatedPartWords ) {
        this.updateSimilarWordToLocal(response.data.updatedPartWords);
        Alert.alert(`[${similarWord}]를 성공적으로 추가했습니다`);
        console.log("part : ", this.part);
      } else {
        Alert.alert('ERROR', '업데이트된 유사명령어롤 서버로부터 가져오지 못했습니다');
      }
    } catch (err) {
      console.log("err : ", err);
    }
  }
  uploadSimilarWordToServer = async (team:number, col: string, similarWord: string) => {
    let config: AxiosRequestConfig = {
      method: 'POST',
      url: `${serverURL}/words/insertPartColWords`,
      data: {
        col,
        team,
        similarWord
      }
    }
    return axios(config);
  }
  updateSimilarWordToLocal = async (similarWords: Array<string>) => {
    const { selectedWord } = this.state;
    if ( ! selectedWord ) {
      console.log("NO SELECTED WORD");
      return false;
    }
    this.part.spells.forEach(spell => {
      if ( spell.main == selectedWord ) {
        spell.similar = similarWords
      }
    });
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
  button: {
    width: 75,
    height: 75
  },
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: "space-between",
    paddingBottom: 30,
    position: 'relative',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  spellMenuContainer: {
    width: (windowRatio < 1.9 ? '80%' : '90%'),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center'
  },
  spellMenuItemWrapper: {
    width: '33.33%',
    aspectRatio: 1.2
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: "700",
    color: 'white',
    marginBottom: 40
  },
  top: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  middle: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0.3,
    borderRadius: 20
  },
  dFlex: {
    display: "flex"
  },
  resultTextContainer: {
    width: '60%',
    height: 50,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  resultText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
  },
  bottom: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'center'
  },
  haxagonBtn: {
    width: 100,
    height: 100
  },
  recordBtn: {
  },
  stopBtn: {
  },
  manualRecordBtn: {
  },

  allStopBtnContainer: {
    padding: 10,
    width: '100%',  //The Width must be the same as the height
    backgroundColor:'rgb(195, 125, 198)',
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
  },
  allStopBtn: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white'
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
  manualWordInput: {
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