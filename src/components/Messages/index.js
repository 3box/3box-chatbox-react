import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import PropTypes from 'prop-types';

import { shortenEthAddr, timeSince } from '../../utils';

import TextMessage from './TextMessage';
import { render } from 'enzyme';

class Message extends Component {
  constructor() {
    super();
  }

  render() {
    const {
      currentUserAddr,
      profile,
      message,
      isFirstMessage,
      colorTheme,
      userProfileURL,
      membersOnline,
    } = this.props;

    const currentUserAddrNormalized = currentUserAddr && currentUserAddr.toLowerCase();
    const commentAddr = profile && profile.ethAddr.toLowerCase();
    const isMyComment = commentAddr === currentUserAddrNormalized;
    const isOnline = membersOnline.includes(message.author);

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
            <>
              {isOnline && <div className="sc-message_online" />}

              <a
                href={profile.profileURL}
                className="sc-message_messager"
                target={userProfileURL ? '_self' : '_blank'}
                rel={userProfileURL ? 'dofollow' : 'noopener noreferrer'}
              >
                {profile.name ? `${profile.name} ${shortenEthAddr(profile.ethAddr)}` : `${shortenEthAddr(profile.ethAddr)}`}
              </a>
            </>
          )}

          {isFirstMessage ? (
            <a
              href={profile.profileURL}
              className="sc-message_avatarWrapper"
              target={userProfileURL ? '_self' : '_blank'}
              rel={userProfileURL ? 'dofollow' : 'noopener noreferrer'}
            >
              <img
                className="sc-message--avatar comment_picture comment_picture-bgWhite"
                src={profilePicture}
                alt="profile"
              />
            </a>
          ) : <div className="sc-message_spacer" />}

          <TextMessage
            messageObj={message}
            isMyComment={isMyComment}
            colorTheme={colorTheme}
          />
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object,
  profile: PropTypes.object,
  isFirstMessage: PropTypes.bool,
  colorTheme: PropTypes.string,
  membersOnline: PropTypes.array,
  currentUserAddr: PropTypes.string,
  userProfileURL: PropTypes.func,
};

export default Message;
