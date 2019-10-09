import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import ChatWindow from './ChatWindow';
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
      mute,
      membersOnline
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
          membersOnline={membersOnline}
          mute={mute}
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
  membersOnline: PropTypes.number,
};

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true,
};

export default Launcher;