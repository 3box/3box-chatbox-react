import React, { Component } from 'react';
import PropTypes from 'prop-types';
import makeBlockie from 'ethereum-blockies-base64';
import SVG from 'react-inlinesvg';

import { shortenEthAddr } from '../utils';

import Message from './Messages';
import LoadingAnimation from './LoadingAnimation';
import closeIcon from '../assets/close-icon-black.svg';

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
      userProfileURL,
      isJoiningThread,
      isShowOnlineList,
      membersOnline,
      handleShowOnlineList,
    } = this.props;

    return (
      <>
        <div className={`onlineList ${isShowOnlineList ? 'show' : ''}`} ref={el => this.scrollList = el}>
          <span className="onlineList_header">
            <div className="onlineList_header_group">
              <div className="onlineList_onlineIcon" />
              <p>Users online</p>
            </div>

            <div className="sc-header--close-button closeOnlineList" onClick={handleShowOnlineList}>
              <SVG src={closeIcon} alt="Close" />
            </div>
          </span>

          <div className="onlineList_members">
            {/* {membersOnline.map(memberDID => {
              const isMe = memberDID === currentUserAddr;
              const profile = profiles[isMe ? currentUserAddr : memberDID];
              const profilePicture = (profile && profile.ethAddr) &&
                (profile.image ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
                  : makeBlockie(profile.ethAddr));

              return (
                <a
                  href={profile.profileURL}
                  className="onlineList_members_link"
                  target={userProfileURL ? '_self' : '_blank'}
                  rel={userProfileURL ? 'dofollow' : 'noopener noreferrer'}
                  key={memberDID}
                >
                  <div className="onlineList_members_profile">
                    <img
                      className="sc-message--avatar comment_picture comment_picture-bgWhite"
                      src={profilePicture}
                      alt="profile"
                    />
                    <h4 className="onlineList_members_profile_name">
                      {profile.name || shortenEthAddr(profile.ethAddr)}
                    </h4>
                  </div>
                </a>
              )
            })} */}
          </div>
        </div>
        <div className={`sc-message-list ${isJoiningThread ? 'isLoading' : ''} ${isShowOnlineList ? '' : 'show'}`} ref={el => this.scrollList = el}>
          {isJoiningThread && (
            <LoadingAnimation colorTheme={colorTheme} threadLoading={isJoiningThread} />
          )}

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
                      membersOnline={membersOnline}
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
        </div>
      </>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.array,
  membersOnline: PropTypes.array,
  profiles: PropTypes.object,
  currentUserAddr: PropTypes.string,
  colorTheme: PropTypes.string,
  userProfileURL: PropTypes.func,
  handleShowOnlineList: PropTypes.func.isRequired,
  isJoiningThread: PropTypes.bool,
  isShowOnlineList: PropTypes.bool,
};

export default MessageList;
