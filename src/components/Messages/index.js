import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';

import TextMessage from './TextMessage';
// import EmojiMessage from './EmojiMessage';

class Message extends Component {

  _renderMessageOfType(type) {
    switch (type) {
      case 'text':
        return <TextMessage {...this.props.message} />;
      // case 'emoji':
      //   return <EmojiMessage {...this.props.message} />;
      default:
        // console.error(`Attempting to load message with unsupported file type '${type}'`);
        return <TextMessage {...this.props.message} />;
    }
  }

  render() {
    const { currentUserAddr, profile, message } = this.props;
    // console.log('profile', profile)
    // console.log('currentUserAddr', currentUserAddr)
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
      <div className="sc-message">
        <div className={contentClassList.join(' ')}>
          <img
            className="sc-message--avatar comment_picture comment_picture-bgWhite"
            src={profilePicture}
            alt="profile"
          />

          {this._renderMessageOfType(this.props.message.type)}
        </div>
      </div>);
  }
}

export default Message;
