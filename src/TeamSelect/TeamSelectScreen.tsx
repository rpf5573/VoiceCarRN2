import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import TeamBox from './TeamBox';
import {teamColors, ROUTES} from '../constants';

type Props = NavigationStackScreenProps<{team: number}>
type States = {
  teamCount: number
}
export default class TeamSelectScreen extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      teamCount: 5,
    }
    this.moveToPartSelectScreen = this.moveToPartSelectScreen.bind(this);
  }
  moveToPartSelectScreen() {
    this.props.navigation.push(ROUTES.PartSelectScreen)
  }
  renderTeamBoxes(teamCount: number) {
    let teamBoxes = [];
    for ( let i = 0; i <= teamCount; i++ ) {
      teamBoxes.push(<TeamBox team={i+1} key={i+1} backgroundColor={teamColors[i]} moveToPartSelectScreen={this.moveToPartSelectScreen}></TeamBox>);
    }
    return teamBoxes;
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderTeamBoxes(this.state.teamCount)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F5FCFF'
  }
});