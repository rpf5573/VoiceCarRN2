import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import {Locale, rapiURL, parts as _parts} from '../constants';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import Voice from "react-native-voice";
import Spell from "./Spell";
import axios from "axios";
import { Part, Parts, Spell as SpellType } from "../@types/index";
import RecordButton from './RecordButton';
import { isObject } from "util";

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {
  active: boolean;
  error: string;
  result: string;
  partialResults: string[];
  matchedSpellCode: number;
};
export default class SpeechScreen extends Component<Props,States> {
  constructor(props: Props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    this.renderSpells = this.renderSpells.bind(this);
    this.sendCommand = this.sendCommand.bind(this);
    this.getMatchedSpell = this.getMatchedSpell.bind(this);
  }
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");
  state = {
    active: false,
    error: "",
    result: "",
    partialResults: [],
    matchedSpellCode: 0
  };
  static navigationOptions = {
    title: "음성인식"
  };

  // render
  renderSpells(part: Part) {
    let spells: JSX.Element[] = [];
    part.spells.forEach((spell, index) => {
      let isMatched = false;
      if (this.state.matchedSpellCode == spell.code) {
        isMatched = true;
      }
      spells.push(
        <Spell key={spell.main + index} spell={spell} isMatched={isMatched} />
      );
    });
    return spells;
  }
  render() {
    let btn = (
      <TouchableWithoutFeedback onPress={this.startRecognizing}>
        <Image
          style={styles.button}
          source={require("../images/ready_button.png")}
        />
      </TouchableWithoutFeedback>
    );
    let middleStyle: any[] = [styles.middle];
    if (this.state.active) {
      btn = (
        <TouchableWithoutFeedback onPress={this.stopRecognizing}>
          <Image
            style={styles.button}
            source={require("../images/active_button.png")}
          />
        </TouchableWithoutFeedback>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.title}>{this.part.korean} 명령어 목록</Text>
          <View style={styles.spellContainer}>
            {this.renderSpells(this.part)}
          </View>
        </View>
        <View style={middleStyle}>
          <Text key='result-1' style={styles.result}>
            {this.state.result}
          </Text>
        </View>
        <View style={styles.bottom}>
          {btn}
          {false && <RecordButton style={styles.recordButton} part={this.part}></RecordButton>}
        </View>
        <View style={styles.allStopBtnContainer}>
          <TouchableWithoutFeedback onPress={() => {
            this.stopRecognizing();
            this.sendCommand(this.part.stop.code, 10, () => {
              this.setState({
                active: false,
                result: '',
                matchedSpellCode: 0
              });
            })}}>
            <Text style={styles.allStopBtn}>중지</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  // custom function
  sendCommand(code: number, speed: number, callback: () => void) {
    callback();
    let url: string = `${rapiURL(this.team)}/${code}/${speed}`;
    console.log('url', url);
    axios(url).then((response) => {
      if ( response.status == 201 ) {
      } else {
      }
    }).catch((err) => {
      Alert.alert("ERROR", "통신에러");
    });
  }
  getMatchedSpell(spell: string): { code: number, speed: number } {
    let matchedSpellCode = 0;
    let speed = 0;
    spell = spell.replace(/\s/g, "");
    console.log('spell', spell);
    this.part.spells.forEach((i: SpellType) => {
      i.similar.forEach((z: string) => {
        if (z == spell) {
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

  // ios 를 위한 처리
  onSpeechEnd = (e: Voice.EndEvent) => {
    console.log("onSpeechEnd");
    // eslint-disable-next-line

    // ios는 result -> end순서로 호출되고,
    // android는 end -> result순서로 호출되기 때문에 다르게 지정해줘야한다
    if ( Platform.OS != 'ios' ) { return; }
    if ( this.state.result == '' ) { return; }

    let result = this.getMatchedSpell(this.state.result);
    console.log('result in speech end', result);
    if ( result.code > 0 ) {
      this.sendCommand(result.code, result.speed, () => {
        this.setState({
          active: false,
          matchedSpellCode: 0
        });
      });
    } else {
      this.setState({
        active: false,
        result: ''
      });
    }
  };
  onSpeechError = (e: Voice.ErrorEvent) => {
    console.log(e);
    this.setState({
      error: JSON.stringify(e.error),
      active: false
    });
  };

  // android 를 위한 처리
  onSpeechResults = (e: Voice.Results) => {
    const val: string = e.value[0];
    console.log(`onSpeechResults - val : ${val}`);
    this.setState({
      result: val
    }, () => {
      if ( Platform.OS != 'android' ) { return; }
      if ( this.state.result == '' ) { return; }

      let result = this.getMatchedSpell(this.state.result);
      console.log('result', result);
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
          result: ''
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
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
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
}

const styles = StyleSheet.create({
  button: {
    width: 75,
    height: 75
  },
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: "space-between",
    paddingBottom: 80,
    position: 'relative'
  },
  spellContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
    marginRight: 10
  },
  title: {
    fontSize: 34,
    textAlign: "center",
    marginBottom: 30
  },
  top: {},
  middle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f2f4f7",
    padding: 10
  },
  dFlex: {
    display: "flex"
  },
  result: {
    fontSize: 30,
    color: 'black'
  },
  bottom: {
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  recordButton: {
    position: "absolute",
    right: 0
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
  }
});