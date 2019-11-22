import React, { Component } from "react";
import A from './A';

type Props = {}
type States = { name: string }
export default class B extends Component<Props, States> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: 'B Component'
    }
    this.sayHello = this.sayHello.bind(this);
  }
  sayHello() {
    console.log(this.state.name);
  }
  render() {
    return (
      <A sayHello={this.sayHello}></A>
    );
  }
}