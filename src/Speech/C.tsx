import React, { Component } from "react";
import A from './A';

type Props = {}
type States = { name: string }
export default class C extends Component<Props, States> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: 'C Component'
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