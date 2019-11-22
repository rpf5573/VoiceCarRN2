import React, { Component } from "react";

type Props = { sayHello: () => void }
type States = { name: string }
export default class A extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    this.props.sayHello();
    return (
      <div>TEST</div>
    );
  }
}