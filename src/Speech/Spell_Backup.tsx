import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Spell as SpellType} from '../@types/index';

type Props = {
  isMatched: boolean,
  spell: SpellType
}
export default class Spell extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    let style = this.props.isMatched ? [styles.spell, styles.red] : [styles.spell];
    return (<Text style={style}>{this.props.spell.main}</Text>)
  }
}

const styles = StyleSheet.create({
  spell: {
    fontSize: 20,
    padding: 6,
    margin: 10,
    backgroundColor: '#00b5ad',
    borderColor: '#00b5ad',
    borderRadius: 6,
    color: '#fff',
    overflow: 'hidden',
  },
  red: {
    backgroundColor: 'red',
    borderColor: 'red'
  }
});