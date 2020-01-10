import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SVG from 'react-inlinesvg';
import Tilt from 'react-tilt';
import TextLoop from "react-text-loop";

import incomingMessageSound from '../assets/sounds/notification.mp3';
import Chat from '../assets/chat-bubble.svg';
import Logo from '../assets/3BoxLogo.svg';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';
import LoadingAnimation from './LoadingAnimation';
import closeIcon from '../assets/close-icon-black.svg';

const options = {
  reverse: true,  // reverse the tilt direction
  max: 35,     // max tilt rotation (degrees)
  perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1,      // 2 = 200%, 1.5 = 150%, etc..
  speed: 300,    // Speed of the enter/exit transition
  transition: true,   // Set a transition on enter/exit.
  axis: null,   // What axis should be disabled. Can be X or Y.
  reset: true,    // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowOnlineList: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { messageList, profiles, currentUserAddr, mute } = this.props;

    if (mute) return;

    const messageGroup = messageList[messageList.length - 1];
    const nextMessage = messageGroup && messageGroup[messageGroup.length - 1];
    const profile = nextMessage && profiles[nextMessage.author];
    const currentUserAddrNormalized = currentUserAddr && currentUserAddr.toLowerCase();
    const commentAddr = profile && profile.ethAddr.toLowerCase();
    const isMyComment = commentAddr === currentUserAddrNormalized;
    const isNew = messageList.length > prevProps.messageList.length;

    if (!isMyComment && isNew) this.playIncomingMessageSound();
  }

  playIncomingMessageSound() {
    var audio = new Audio(incomingMessageSound);
    audio.play();
  }

  handleShowOnlineList = () => {
    const { isShowOnlineList } = this.state;
    this.setState({ isShowOnlineList: !isShowOnlineList });
  }

  render() {
    const {
      currentUser3BoxProfile,
      currentUserAddr,
      threadJoined,
      agentProfile,
      openThread,
      threadLoading,
      notPopup,
      onClose,
      profiles,
      showEmoji,
      colorTheme,
      membersOnlineLength,
      noWeb3,
      ethereum,
      userProfileURL,
      isJoiningThread,
      membersOnline,
      postMessage,
      loginFunction,
      box,
    } = this.props;

    const { isShowOnlineList } = this.state;

    let messageList = this.props.messageList || [];
    let chatWindowClassList;
    let joinThreadWindowClassList;

    if (notPopup) {
      chatWindowClassList = [
        'sc-chat-window',
        (threadJoined ? 'opened' : 'closed')
      ];

      joinThreadWindowClassList = [
        'joinThreadWindow',
        (!threadJoined ? 'opened' : 'closed')
      ];
    } else {
      chatWindowClassList = [
        'sc-chat-window',
        ((this.props.isOpen && threadJoined) ? 'opened' : 'closed')
      ];

      joinThreadWindowClassList = [
        'joinThreadWindow',
        ((this.props.isOpen && !threadJoined) ? 'opened' : 'closed')
      ];
    }

    return (
      <div className={notPopup ? 'chat' : 'popupChat'} id={`${notPopup ? 'sc-launcher' : ''}`}>
        <div className={joinThreadWindowClassList.join(' ')}>
          <div className="joinThreadWindow_wrapper">
            <div className="joinThreadWindow_wrapper--close-button" onClick={onClose}>
              <SVG src={closeIcon} alt="Close" className="joinThreadWindow_wrapper_close_icon" />
            </div>

            <div className="joinThreadWindow_wrapper_image" style={{ backgroundColor: colorTheme }}>
              {agentProfile.imageUrl ? (
                <img
                  src={agentProfile.imageUrl}
                  alt="Thread"
                  className="joinThreadWindow_wrapper_image_pic"
                  style={{ backgroundColor: colorTheme || "#181F21" }}
                />
              ) : <SVG src={Chat} alt="Logo" className="joinThreadWindow_wrapper_image_pic" />}
            </div>

            <div className="joinThreadWindow_wrapper_header">
              <h3 className="joinThreadWindow_wrapper_header_title">
                {agentProfile.chatName}
              </h3>
            </div>

            <div className={`joinThreadWindow_wrapper_loading  ${threadLoading ? 'show' : ''}`} >
              <TextLoop interval="3400" noWrap={false} adjustingSpeed={1000}>
                <p className="joinThreadWindow_wrapper_loading_text">
                  Loading 3Box
                  </p>
                <p className="joinThreadWindow_wrapper_loading_text">
                  Joining chat
                  </p>
                <p className="joinThreadWindow_wrapper_loading_text">
                  Approve in your wallet
                  </p>
              </TextLoop>
            </div>

            <div className="joinThreadWindow_wrapper_buttonDiv">
              {noWeb3 && (
                <p className="joinThreadWindow_wrapper_buttonDiv_error">
                  Web3 is required for Chatbox
                </p>
              )}

              {(loginFunction && !box) && (
                <Tilt options={options}>
                  <button
                    className={`joinThreadWindow_wrapper_button  ${threadLoading ? '' : 'show'}`}
                    onClick={openThread}
                    style={{ backgroundColor: colorTheme }}
                  >
                    Join
                  </button>
                </Tilt>)}

              <LoadingAnimation colorTheme={colorTheme} threadLoading={threadLoading} />
            </div>

            <div className="chatbox_footer">
              <span className="footer_text">
                <a href="https://docs.3box.io/build/web-apps/messaging/ghost-threads" target="_blank" rel="noopener noreferrer">
                  Decentralized chat by
                  <SVG src={Logo} alt="Logo" className="footer_text_image" />
                </a>
              </span>
            </div>
          </div>
        </div >

        <div className={chatWindowClassList.join(' ')}>
          <Header
            chatName={agentProfile.chatName}
            imageUrl={agentProfile.imageUrl}
            handleShowOnlineList={this.handleShowOnlineList}
            onClose={onClose}
            colorTheme={colorTheme}
            membersOnlineLength={membersOnlineLength}
            currentUser3BoxProfile={currentUser3BoxProfile}
            isShowOnlineList={isShowOnlineList}
            ethereum={ethereum}
          />

          <MessageList
            messages={messageList}
            imageUrl={agentProfile.imageUrl}
            handleShowOnlineList={this.handleShowOnlineList}
            currentUserAddr={currentUserAddr}
            profiles={profiles}
            userProfileURL={userProfileURL}
            colorTheme={colorTheme}
            isJoiningThread={isJoiningThread}
            isShowOnlineList={isShowOnlineList}
            membersOnline={membersOnline}
          />

          <UserInput
            currentUser3BoxProfile={currentUser3BoxProfile}
            currentUserAddr={currentUserAddr}
            postMessage={postMessage}
            showEmoji={showEmoji}
            userProfileURL={userProfileURL}
            threadJoined={threadJoined}
          />
        </div>
      </div >
    );
  }
}

ChatWindow.propTypes = {
  agentProfile: PropTypes.object.isRequired,
  ethereum: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  postMessage: PropTypes.func.isRequired,
  openThread: PropTypes.func.isRequired,
  userProfileURL: PropTypes.func,
  showEmoji: PropTypes.bool,
  threadJoined: PropTypes.bool,
  threadLoading: PropTypes.bool,
  isJoiningThread: PropTypes.bool,
  mute: PropTypes.bool,
  notPopup: PropTypes.bool,
  isShowOnlineList: PropTypes.bool,
  noWeb3: PropTypes.bool,
  currentUser3BoxProfile: PropTypes.object,
  currentUserAddr: PropTypes.string,
  colorTheme: PropTypes.string,
  profiles: PropTypes.object,
  messageList: PropTypes.array,
  membersOnline: PropTypes.array,
  membersOnlineLength: PropTypes.number,
};

export default ChatWindow;
