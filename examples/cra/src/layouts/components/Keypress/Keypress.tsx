import React, { Component } from 'react';

export const Keypress: React.FC = ({ children }) => {
  return <kbd>{children}</kbd>;
};

export class KeyPad extends Component {
  public render() {
    const { children } = this.props;

    return (
      <div>
        <span>press</span>

        {children}

        <span>to try! 🍭</span>
      </div>
    );
  }
}
