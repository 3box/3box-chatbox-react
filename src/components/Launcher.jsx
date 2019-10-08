import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import ChatWindow from './ChatWindow';
import incomingMessageSound from '../assets/sounds/notification.mp3';
import launcherIconActive from '../assets/close-icon.png';
import Chat from '../assets/Chat2.svg';

import styles from '../styles';

class Launcher extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  // componentDidUpdate(prevProps) {
  //   const { messageList, profiles, currentUserAddr } = this.props;

  //   if (this.props.mute) { return; }

  //   const messageGroup = messageList[messageList.length - 1];
  //   const nextMessage = messageGroup && messageGroup[messageGroup.length - 1];
  //   const profile = nextMessage && profiles[nextMessage.author];
  //   const currentUserAddrNormalized = currentUserAddr && currentUserAddr.toLowerCase();
  //   const commentAddr = profile && profile.ethAddr.toLowerCase();
  //   const isMyComment = commentAddr === currentUserAddrNormalized;
  //   const isNew = messageList.length > prevProps.messageList.length;

  //   if (!isMyComment && isNew) this.playIncomingMessageSound();
  // }

  // playIncomingMessageSound() {
  //   var audio = new Audio(incomingMessageSound);
  //   audio.play();
  // }

  handleClick() {
    if (this.props.handleClick !== undefined) {
      this.props.handleClick();
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  }

  render() {
    const {
      currentUserAddr,
      currentUser3BoxProfile,
      threadJoined,
      openThread,
      threadLoading,
      colorTheme,
      onMessageWasSent,
      isOpen,
      agentProfile,
      messageList,
      showEmoji,
      profiles,
      numUsersOnline,
      mute
    } = this.props;

    const classList = [
      'sc-launcher',
      (isOpen ? 'opened' : ''),
    ];

    return (
      <div id="sc-launcher">
        <div
          className={classList.join(' ')}
          onClick={this.handleClick.bind(this)}
          style={{ backgroundColor: colorTheme }}
        >
          <MessageCount count={this.props.newMessagesCount} isOpen={isOpen} />
          <img className={'sc-open-icon'} src={launcherIconActive} />
          <SVG src={Chat} alt="Logo" className={'sc-closed-icon'} />
        </div>

        <ChatWindow
          messageList={messageList}
          onUserInputSubmit={onMessageWasSent}
          agentProfile={agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          showEmoji={showEmoji}
          profiles={profiles}
          currentUser3BoxProfile={currentUser3BoxProfile}
          currentUserAddr={currentUserAddr}
          threadJoined={threadJoined}
          openThread={openThread}
          threadLoading={threadLoading}
          colorTheme={colorTheme}
          numUsersOnline={numUsersOnline}
          mute={mute}
        />
      </div>
    );
  }
}

const MessageCount = ({ count, isOpen }) => {
  if (count === 0 || isOpen === true) { return null; }
  return (
    <div className={'sc-new-messages-count'}>
      {count}
    </div>
  );
};

Launcher.propTypes = {
  onMessageWasReceived: PropTypes.func,
  onMessageWasSent: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  openThread: PropTypes.func,
  messageList: PropTypes.array,
  mute: PropTypes.bool,
  showEmoji: PropTypes.bool,
  threadJoined: PropTypes.bool,
  threadLoading: PropTypes.bool,
  currentUserAddr: PropTypes.string,
  colorTheme: PropTypes.string,
  agentProfile: PropTypes.string,
  currentUser3BoxProfile: PropTypes.object,
  profiles: PropTypes.object,
  numUsersOnline: PropTypes.number,
};

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true,
};

export default Launcher;