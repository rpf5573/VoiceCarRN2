import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback, Alert} from 'react-native';

type Props = {
  backgroundColor: string
  team: number,
  moveToPartSelectScreen: () => void
}
export default class TeamBox extends Component<Props> {
  render() {
    return(
      <View style={[styles.teamBox, {backgroundColor: this.props.backgroundColor}]}>
        <TouchableWithoutFeedback onPress={() => {
          Alert.alert(
            `${this.props.team}팀으로 입장하시겠습니까?`, '', [
              {
                text: '아니오',
                onPress: () => { }
              },
              {
                text: '예',
                onPress: () => {this.props.moveToPartSelectScreen()}
              }
            ]
          )
        }}>
          <Text style={styles.btnText}>{`${this.props.team}팀`} </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  teamBox: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 50,
    color: '#EEEEEE'
  }
});