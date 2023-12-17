import React, { Component } from "react";

export default class RefSample extends Component {
  input = React.createRef();
  handleFocur = () => {
    this.input.current.focus();
  };
  render() {
    return (
      <div>
        <input ref={this.input} />
      </div>
    );
  }
}
