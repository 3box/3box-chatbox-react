import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import PropTypes from 'prop-types';

import { shortenEthAddr, timeSince, checkEmojis } from '../../utils';

import TextMessage from './TextMessage';
import EmojiMessage from './EmojiMessage';

class Message extends Component {

  _renderMessageOfType(message, isMyComment, colorTheme) {
    const isEmoji = checkEmojis(message);

    if (isEmoji) {
      return <EmojiMessage {...this.props.message} />;
    } else {
      return (
        <TextMessage
          {...this.props.message}
          isMyComment={isMyComment}
          colorTheme={colorTheme}
        />
      );
    }
  }

  render() {
    const {
      currentUserAddr,
      profile,
      message,
      isFirstMessage,
      isLastMessage,
      colorTheme,
    } = this.props;

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
            <a href={profile.profileURL} className="sc-message_messager" >
              {`${profile.name} ${shortenEthAddr(profile.ethAddr)}`}
            </a>
          )}

          {isLastMessage ? (
            <a href={profile.profileURL} className="sc-message_avatarWrapper" >
              <img
                className="sc-message--avatar comment_picture comment_picture-bgWhite"
                src={profilePicture}
                alt="profile"
              />
            </a>
          ) : <div className="sc-message_spacer" />}

          {this._renderMessageOfType(message.message, isMyComment, colorTheme)}
        </div>
      </div>);
  }
}

Message.propTypes = {
  message: PropTypes.string,
  profile: PropTypes.object,
  isFirstMessage: PropTypes.bool,
  isLastMessage: PropTypes.bool,
  colorTheme: PropTypes.string,
  currentUserAddr: PropTypes.string,
};

export default Message;
