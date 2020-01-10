import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import ChatWindow from './ChatWindow';
import launcherIconActive from '../assets/close-icon.svg';
import Chat from '../assets/chat-bubble.svg';

import styles from '../styles';

class Launcher extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

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
      threadLoading,
      colorTheme,
      postMessage,
      isOpen,
      agentProfile,
      messageList,
      showEmoji,
      profiles,
      mute,
      membersOnlineLength,
      noWeb3,
      ethereum,
      userProfileURL,
      isJoiningThread,
      membersOnline,
      newMessagesCount,
      loginFunction,
      box,
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
          <MessageCount count={newMessagesCount} isOpen={isOpen} />
          <SVG className="sc-open-icon" src={launcherIconActive} />
          <SVG src={Chat} alt="Logo" className="sc-closed-icon" />
        </div>

        <ChatWindow
          messageList={messageList}
          postMessage={postMessage}
          agentProfile={agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          showEmoji={showEmoji}
          profiles={profiles}
          currentUser3BoxProfile={currentUser3BoxProfile}
          currentUserAddr={currentUserAddr}
          threadJoined={threadJoined}
          threadLoading={threadLoading}
          colorTheme={colorTheme}
          membersOnlineLength={membersOnlineLength}
          mute={mute}
          ethereum={ethereum}
          noWeb3={noWeb3}
          userProfileURL={userProfileURL}
          isJoiningThread={isJoiningThread}
          membersOnline={membersOnline}
          loginFunction={loginFunction}
          box={box}
        />
      </div>
    );
  }
}

const MessageCount = ({ count, isOpen }) => {
  if (count === 0 || isOpen === true) return null;
  return (
    <div className={'sc-new-messages-count'}>
      {count}
    </div>
  );
};

Launcher.propTypes = {
  onMessageWasReceived: PropTypes.func,
  postMessage: PropTypes.func,
  userProfileURL: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  loginFunction: PropTypes.func,
  messageList: PropTypes.array,
  membersOnline: PropTypes.array,
  mute: PropTypes.bool,
  showEmoji: PropTypes.bool,
  threadJoined: PropTypes.bool,
  threadLoading: PropTypes.bool,
  isJoiningThread: PropTypes.bool,
  noWeb3: PropTypes.bool,
  currentUserAddr: PropTypes.string,
  colorTheme: PropTypes.string,
  agentProfile: PropTypes.object,
  currentUser3BoxProfile: PropTypes.object,
  profiles: PropTypes.object,
  ethereum: PropTypes.object,
  box: PropTypes.object,
  membersOnlineLength: PropTypes.number,
};

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true,
};

export default Launcher;