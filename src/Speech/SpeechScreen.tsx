import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  Dimensions,
  Button,
  TextInput,
} from "react-native";
import {Locale, parts, SpeechSpellMenuButtonType} from '../constants';
import Voice from "react-native-voice";
import SpeechSpellMenuButton from "./SpeechSpellMenuButton";
import axios from "axios";
import { Part, Spell, ISpeechScreen } from "../@types/index";
import RecordBtn from './RecordBtn';
import StopBtn from './StopBtn';
import ManualRecordBtn from './ManualRecordBtn';
import Modal from "react-native-modal";
import {AxiosRequestConfig} from "axios";

type Props = {
  part: Part,
  onSpeechResults: (e: Voice.Results) => void,
  finishRecognizing: () => Promise<void>,
  onSpeechPartialResults?: (e: Voice.PartialResults) => void
}
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
  part: Part = this.props.part;
  isDisabledVoiceBtn: boolean = false;
  defaultState = {
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
  state = {...this.defaultState};
  static navigationOptions = {
    title: "음성인식"
  };
  elements: any[] = []

  constructor(props: Props) {
    super(props);

    // bind를 해줘야 SpeechScreen을 상속받는 클래스의 함수를 호출한다.
    // 안해주고 arrow function쓰면 상속받는 클래스(SpeechScreenIOS)의 함수를 호출 안하고 여기에있는 함수를 호출한다₩
    this.sendCommand = this.sendCommand.bind(this);
    this.getMatchedSpell = this.getMatchedSpell.bind(this);

    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.props.onSpeechResults
    if ( this.props.onSpeechPartialResults ) {
      Voice.onSpeechPartialResults = this.props.onSpeechPartialResults
    }

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
            <RecordBtn onPress={this.handleRecordBtnClick} style={styles.haxagonBtn} backgroundColor={ this.state.active ? 'blue' : weakRed}></RecordBtn>
            <StopBtn style={styles.haxagonBtn} backgroundColor='red' onPress={this.stop}></StopBtn>
            {
              global.userCanEditSpeedAndWords && 
              <ManualRecordBtn style={styles.haxagonBtn} backgroundColor={weakRed} onPress={this.toggleManualRecordModal} strokColor={this.state.selectedWord ? 'aqua' : undefined}></ManualRecordBtn>
            }
          </View>
        </View>
        <Modal isVisible={this.state.isManualRecordModalVisible} onBackdropPress={this.toggleManualRecordModal} style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <Text style={[styles.textMiddle,styles.modalInnerText]}>
              <Text style={styles.selectedWord}>[{this.state.selectedWord}]</Text>
              <Text>에 해당하는{"\n"} 유사명령어를 입력해주세요</Text>
            </Text>
            <TextInput placeholder={"음성 기록"} style={styles.manualWordInput} onChangeText={text => {this.setState({manualWord: text})}}></TextInput>
            <View style={{margin:10}}></View>
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
  handleRecordBtnClick = () => {
    if ( this.isDisabledVoiceBtn ) {
      return;
    }
    this.isDisabledVoiceBtn = true;
    if ( this.state.active ) {
      this.finishRecognizing();
    } else {
      this.startRecognizing();
    }
    setTimeout(() => { this.isDisabledVoiceBtn = false }, 800);
  }

  // custom function
  sendCommand = (code: number, speed: number, callback?: () => void) => {
    let url: string = `${global.rapiURL()}/${code}/${speed}`;
    console.log('url in sendCommand', url);
    axios(url).then((response) => {
      if ( response.status == 201 ) {
        if ( callback ) { callback(); }
      } else {
      }
    }).catch((err) => {
      Alert.alert("ERROR", "배터리 방전 / 알수없는 오류");
    });
  }
  getMatchedSpell = (spellWord: string): { code: number, speed: number } => {
    let matchedSpellCode = 0;
    let speed = 0;
    spellWord = spellWord.replace(/\s/g, "");
    this.part.spells.some((i: Spell) => {
      // 관리자가 초기값을 null로 설정하면 값이 없을수도 있응께
      if ( ! i.similar || ! Array.isArray(i.similar) ) { return false; }
      // 그담에 유사단어 검사!
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

  // 이거는 SpeechScreenIOS/Android 에서 정의해주는거다
  onSpeechResults = this.props.onSpeechResults;
  startRecognizing = async () => {
    if ( this.state.selectedWord ) { return Alert.alert("유사명령어 입력중에는 포크봇을 조종할 수 없습니다"); }
    try {
      await Voice.start(Locale.ko_KR);
      this.setState({...this.defaultState, active: true});
    } catch (e) {
      console.error(e);
    }
  };
  finishRecognizing = this.props.finishRecognizing;
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

  stop = async () => {
    if ( this.state.selectedWord ) { return Alert.alert("유사명령어 입력중에는 포크봇을 조종할 수 없습니다"); }
    try {
      await Voice.cancel();
      this.setState({...this.defaultState}, () => {
        this.sendCommand(this.part.stop.code, 10);
      });
    } catch(e) {
      console.log('error in cancelREcogizing');
      console.error(e);
    }
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
    // 음성인식중에는 유사명령어 입력 못하게 막자
    if ( this.state.active ) { return Alert.alert("음성인식중에는 설정할 수 없습니다"); }
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
      let response = await this.uploadSimilarWordToServer(col, similarWord);
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
  uploadSimilarWordToServer = async (col: string, similarWord: string) => {
    const team = global.team;
    let config: AxiosRequestConfig = {
      method: 'POST',
      url: `${global.serverURL()}/words/insertPartColWords`,
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