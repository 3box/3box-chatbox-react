import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from './Messages';

class MessageList extends Component {
  componentDidUpdate() {
    this.scrollList.scrollTop = this.scrollList.scrollHeight;
  }

  render() {
    const {
      messages,
      profiles,
      currentUserAddr,
      colorTheme,
      userProfileURL
    } = this.props;
    console.log('colorTheme5', colorTheme);

    return (
      <div className="sc-message-list" ref={el => this.scrollList = el}>
        {messages.map((userGrouping, i) => {
          const profile = profiles[userGrouping[0].author];
          const currentUserAddrNormalized = currentUserAddr && currentUserAddr.toLowerCase();
          const commentAddr = profile && profile.ethAddr.toLowerCase();
          const isMyComment = commentAddr === currentUserAddrNormalized;

          return (
            <div className={`sc-message_group ${isMyComment ? 'myGroup' : ''}`} key={i}>
              {userGrouping.map((message, i) => {
                return (
                  <Message
                    message={message}
                    userProfileURL={userProfileURL}
                    key={i}
                    currentUserAddr={currentUserAddr}
                    profile={profiles[message.author]}
                    isFirstMessage={i === 0}
                    colorTheme={colorTheme}
                  />
                );
              })}
            </div>
          )
        })}
      </div>);
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  profiles: PropTypes.object,
  currentUserAddr: PropTypes.string,
  colorTheme: PropTypes.string,
  userProfileURL: PropTypes.func,
};

export default MessageList;
