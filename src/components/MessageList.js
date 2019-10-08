import React, { Component } from 'react';
import Message from './Messages';
import makeBlockie from 'ethereum-blockies-base64';

import { sortChronologicallyAndGroup } from '../utils';

class MessageList extends Component {

  componentDidUpdate(_prevProps, _prevState) {
    this.scrollList.scrollTop = this.scrollList.scrollHeight;
  }

  render() {
    const { messages, profiles, currentUserAddr, colorTheme } = this.props;
    const sortedChat = sortChronologicallyAndGroup(messages);

    return (
      <div className="sc-message-list" ref={el => this.scrollList = el}>
        {sortedChat.map((userGrouping, i) => {
          const profile = profiles[userGrouping[0].author];
          const profilePicture = (profile && profile.ethAddr) &&
            (profile.image ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
              : makeBlockie(profile.ethAddr));
          const currentUserAddrNormalized = currentUserAddr && currentUserAddr.toLowerCase();
          const commentAddr = profile && profile.ethAddr.toLowerCase();
          const isMyComment = commentAddr === currentUserAddrNormalized;

          return (
            <div className={`sc-message_group ${isMyComment ? 'myGroup' : ''}`} key={i}>
              {userGrouping.map((message, i) => {
                return (
                  <Message
                    message={message}
                    key={i}
                    currentUserAddr={currentUserAddr}
                    profile={profiles[message.author]}
                    isLastMessage={userGrouping.length - 1 === i}
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

export default MessageList;
