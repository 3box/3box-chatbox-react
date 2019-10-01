import React, { Component } from 'react';
import Message from './Messages';

import { sortChronologically } from '../utils';

class MessageList extends Component {

  componentDidUpdate(_prevProps, _prevState) {
    this.scrollList.scrollTop = this.scrollList.scrollHeight;
  }

  render() {
    const { messages, profiles, currentUserAddr } = this.props;
    const sortedChat = sortChronologically(messages);
    return (
      <div className="sc-message-list" ref={el => this.scrollList = el}>
        {sortedChat.map((message, i) => {
          return (
            <Message
              message={message}
              key={i}
              currentUserAddr={currentUserAddr}
              profile={profiles[message.author]}
            />
          );
        })}
      </div>);
  }
}

export default MessageList;
