import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground, Text, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import '../global';
import { ROUTES, parts } from '../constants';
import axios from "axios";
import {AxiosRequestConfig} from "axios";

type Props = NavigationStackScreenProps<{}>
type States = {
  password: string,
  submitBtnDisabled: boolean,
}

export default class EntranceScreen extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.moveToPartSelectScreen = this.moveToPartSelectScreen.bind(this);
    this.login = this.login.bind(this);
    this.testmode = this.testmode.bind(this);
    this.state = {
      password: '',
      submitBtnDisabled: false,
    }
  }

  moveToPartSelectScreen() {
    this.props.navigation.push(ROUTES.PartSelectScreen, {});
  }
  login(password: string) {
    password = password.toLowerCase();
    global.group = password.substring(0, 1); // group setting
    if ( ! ["a", "b"].includes(global.group) ) {
      Alert.alert("ERROR", "비밀번호의 시작은 a혹은 b로 시작해야합니다.");
      return;
    }

    this.setState({
      submitBtnDisabled: true
    });
    let config: AxiosRequestConfig = {
      method: 'POST',
      url: `${global.serverURL()}/user/login`,
      data: {
        password
      }
    }
    axios(config).then((response) => {
      this.setState({
        submitBtnDisabled: false
      });
      if (response.status == 201) {
        if (response.data.error) {
          console.log("error", response.data.error);
          // Alert.alert(response.data.error);
          return;
        }
        global.team = response.data.team; // team setting
        global.rcUsageState = parseInt(response.data.rcUsageState) ? true : false; // rcUsageState setting
        this.moveToPartSelectScreen();
      } else {
        Alert.alert("ERROR", "서버에 문제가 있습니다");
      }
    }).catch((err) => {
      console.log(err);
      this.setState({
        submitBtnDisabled: false
      }, () => {
        Alert.alert("ERROR", "알수없는 에러가 발생했습니다");
      });
    });
  }
  testmode(t: number) {
    if (t == 1) {
      let arr: Array<string> = [
        'motor-1/forward/100',
        'motor-1/backward/100',
        'motor-1/stop',
        'motor-2/forward/100',
        'motor-2/backward/100',
        'motor-2/stop',
        'motor-3/forward/100',
        'motor-3/backward/100',
        'motor-3/stop',
        'motor-4/forward/100',
        'motor-4/backward/100',
        'motor-4/stop',
        'motor-5/forward/100',
        'motor-5/backward/100',
        'motor-5/stop',
        'motor-6/forward/100',
        'motor-6/backward/100',
        'motor-6/stop',
      ];
      for(var i = 0; i < arr.length; i++){
        let time = 5000*i;
        if (i%3 == 0) {
          time -= 4000;
        }
        let url = `${rapiURL(2)}/${arr[i]}`;
        setTimeout(() => {
          axios(url).then(response => {
            
          }).catch((err) => {
            console.warn(err);
          });
        }, time);
      }
    } else if (t == 2) {

      // all forward
      let arr: Array<string> = [
        'motor-1/forward/100',
        'motor-2/forward/100',
        'motor-3/forward/100',
        'motor-4/forward/100',
        'motor-5/forward/100',
        'motor-6/forward/100',
      ]
      for(let i = 0; i < arr.length; i++){
        let time = 100*i;
        setTimeout(() => {
          axios(`${rapiURL(2)}/${arr[i]}`)
        }, time);
      }

      // all backward
      arr = [
        'motor-1/backward/100',
        'motor-2/backward/100',
        'motor-3/backward/100',
        'motor-4/backward/100',
        'motor-5/backward/100',
        'motor-6/backward/100',
      ]
      for(let i = 0; i < arr.length; i++){
        let time = 10000*i;
        setTimeout(() => {
          axios(`${rapiURL(1)}/${arr[i]}`)
        }, time);
      }
      
      // all stop
      arr = [
        'motor-1/stop',
        'motor-2/stop',
        'motor-3/stop',
        'motor-4/stop',
        'motor-5/stop',
        'motor-6/stop',
      ]
      for(let i = 0; i < arr.length; i++) {
        let time = 15000*i;
        setTimeout(() => {
          axios(`${rapiURL(1)}/${arr[i]}`);
        }, time);
      }
    }
  }
  resetSimilarSpells() {
    parts.ARM.spells.forEach(spell => {
      spell.similar = [];
    });
    parts.BOTTOM.spells.forEach(spell => {
      spell.similar = [];
    });
    parts.HAND.spells.forEach(spell => {
      spell.similar = [];
    });
    parts.WAIST.spells.forEach(spell => {
      spell.similar = [];
    });
  }
  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} enabled>
        <ImageBackground source={require("../images/background.jpeg")} style={styles.backgroundImage}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput}
                  placeholder="비밀번호 입력"
                  onChangeText={(text) => {this.setState({password: text})}}
                  underlineColorAndroid='transparent'/>
                <TouchableOpacity
                  disabled={this.state.submitBtnDisabled}
                  style={styles.passwordSubmitBtn}
                  onPress={() => { this.login(this.state.password) }}>
                  <Text>로그인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%'
  },
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textLogo: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  passwordContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '15%',
    paddingLeft: 40,
    paddingRight: 40,
  },
  passwordInput: {
    minHeight: 45,
    width: '100%',
    backgroundColor: 'white',
    fontSize: 20,
    padding: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  passwordSubmitBtn: {
    width: '100%',
    backgroundColor: '#01c853',
    alignSelf: 'stretch',
    padding: 15,
    alignItems: 'center',
  }
});