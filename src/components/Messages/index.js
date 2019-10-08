import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';

import { shortenEthAddr, timeSince, checkEmojis } from '../../utils';

import TextMessage from './TextMessage';
import EmojiMessage from './EmojiMessage';

class Message extends Component {

  _renderMessageOfType(message, isMyComment, colorTheme) {
    const isEmoji = checkEmojis(message);
    if (isEmoji) {
      return <EmojiMessage {...this.props.message} />;
    } else {
      return <TextMessage {...this.props.message} isMyComment={isMyComment} colorTheme={colorTheme} />;
    }
    // switch (message) {
    //   // if message is one emoji, use emoji component
    //   case 'text':
    //     return <TextMessage {...this.props.message} />;
    //   // case 'emoji':
    //   //   return <EmojiMessage {...this.props.message} />;
    //   default:
    //     // console.error(`Attempting to load message with unsupported file type '${type}'`);
    //     return <TextMessage {...this.props.message} />;
    // }
  }

  render() {
    const { currentUserAddr, profile, message, isFirstMessage, isLastMessage, colorTheme } = this.props;
    const currentUserAddrNormalized = currentUserAddr && currentUserAddr.toLowerCase();
    const commentAddr = profile && profile.ethAddr.toLowerCase();
    const isMyComment = commentAddr === currentUserAddrNormalized;

    let contentClassList = [
      'sc-message--content',
      (isMyComment ? 'sent' : 'received')
    ];

    const profilePicture = (profile && profile.ethAddr) &&
      (profile.image ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
        : makeBlockie(profile.ethAddr));

    return (
      <div className="sc-message" title={`${timeSince(message.timestamp * 1000)} ago`}>
        <div className={contentClassList.join(' ')}>
          {(!isMyComment && isFirstMessage) && (
            <p className="sc-message_messager" >
              {`${profile.name} ${shortenEthAddr(profile.ethAddr)}`}
            </p>)}

          {isLastMessage ? (
            <img
              className="sc-message--avatar comment_picture comment_picture-bgWhite"
              src={profilePicture}
              alt="profile"
            />) : <div className="sc-message_spacer" />}

          {this._renderMessageOfType(message.message, isMyComment, colorTheme)}
        </div>
      </div>);
  }
}

export default Message;
