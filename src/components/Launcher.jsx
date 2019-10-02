import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SVG from 'react-inlinesvg';

import ChatWindow from './ChatWindow';
import launcherIcon from './../assets/logo-no-bg.svg';
import incomingMessageSound from '../assets/sounds/notification.mp3';
import launcherIconActive from '../assets/close-icon.png';
import Chat from '../assets/Chat2.svg';

import styles from '../styles';

class Launcher extends Component {
  constructor() {
    super();
    this.state = {
      launcherIcon,
      isOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mute) { return; }
    const nextMessage = nextProps.messageList[nextProps.messageList.length - 1];
    const isIncoming = (nextMessage || {}).author === 'them';
    const isNew = nextProps.messageList.length > this.props.messageList.length;
    if (isIncoming && isNew) {
      this.playIncomingMessageSound();
    }
  }

  playIncomingMessageSound() {
    var audio = new Audio(incomingMessageSound);
    audio.play();
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
      onMessageWasSent
    } = this.props;

    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen;
    const classList = [
      'sc-launcher',
      (isOpen ? 'opened' : ''),
    ];

    return (
      <div id="sc-launcher">
        <div
          className={classList.join(' ')}
          onClick={this.handleClick.bind(this)}
          style={{ backgroundColor: colorTheme}}
        >
          <MessageCount count={this.props.newMessagesCount} isOpen={isOpen} />
          <img className={'sc-open-icon'} src={launcherIconActive} />
          {/* <img className={'sc-closed-icon'} src={launcherIcon} /> */}
          <SVG src={Chat} alt="Logo" className={'sc-closed-icon'} />

        </div>

        <ChatWindow
          messageList={this.props.messageList}
          onUserInputSubmit={onMessageWasSent}
          agentProfile={this.props.agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          showEmoji={this.props.showEmoji}
          profiles={this.props.profiles}
          currentUser3BoxProfile={currentUser3BoxProfile}
          currentUserAddr={currentUserAddr}
          threadJoined={threadJoined}
          openThread={openThread}
          threadLoading={threadLoading}
        />
      </div>
    );
  }
}

const MessageCount = (props) => {
  if (props.count === 0 || props.isOpen === true) { return null; }
  return (
    <div className={'sc-new-messages-count'}>
      {props.count}
    </div>
  );
};

Launcher.propTypes = {
  onMessageWasReceived: PropTypes.func,
  onMessageWasSent: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  messageList: PropTypes.arrayOf(PropTypes.object),
  mute: PropTypes.bool,
  showEmoji: PropTypes.bool,
};

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true
};

export default Launcher;