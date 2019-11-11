import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ViewComponent,
  StyleProp,
  ViewStyle,
  TextInput
} from "react-native";
import axios from "axios";
import { TouchableHighlight } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { Part, Parts, Spell as SpellType } from "../@types/index";
import { serverURL, parts } from '../constants';

type States = {
  isModalOpen: boolean,
  word: string
}
type Props = {
  style: StyleProp<ViewStyle>,
  part: Part
}
export default class RecordButton extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      word: ''
    }
  }
  render() {
    return (
      <View style={this.props.style}>
        <View style={[styles.button, this.props.style]}>
          <TouchableWithoutFeedback onPress={() => { this.setState({ isModalOpen: true }); }}>
            <Text style={styles.text}>기록</Text>
          </TouchableWithoutFeedback>
        </View>
        <Modal
        animationIn="slideInLeft"
        animationOut="slideOutRight"
        style={styles.modalContainer}
        isVisible={this.state.isModalOpen}
        onBackButtonPress={() => { this.setState({ isModalOpen: false }) }}
        onBackdropPress={() => { this.setState({ isModalOpen: false }) }}
        >
          <View style={styles.modal}>
            <View style={styles.modal__top}>
              <Text style={{fontSize: 20, marginBottom: 10}}>단어 입력</Text>
              <View style={styles.modal__input_container}>
                <TextInput style={styles.modal__input} maxLength={8} onChangeText={(text) => { this.setState({ word: text }); }}></TextInput>
              </View>
            </View>
            <View style={styles.modal__bottom}>
              <TouchableHighlight
                onPress={() => { this.setState({ isModalOpen: false }) }}>
                <Text style={styles.modal__bottom__cancel}> 취소 </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => { axios }}>
                <Text style={styles.modal__bottom__ok}> 확인 </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
  recordWord = (word: string) => {
    this.props.part.spells
  }
}

const styles = {
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: 'green'
  },
  text: {
    fontSize: 20
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    width: '60%',
    height: '30%',
  },
  modal__top: {
    flex: 1,
    backgroundColor: 'red',
    padding: 12,
  },
  modal__input: {
    minHeight: 35,
    width: '100%',
    backgroundColor: 'white',
    fontSize: 16,
    padding: 10,
  },
  modal__input_container: {
    
  },
  modal__bottom: {
    flexDirection: 'row',
    backgroundColor: 'yellow',
    justifyContent: 'space-around',
    marginTop: 6,
    marginBottom: 6,
  },
  modal__bottom__cancel: {
    fontSize: 18
  },
  modal__bottom__ok: {
    fontSize: 18
  }
}