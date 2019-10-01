import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import SVG from 'react-inlinesvg';
import Logo from '../assets/3BoxLogoWhite.svg';

import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';

class ChatWindow extends Component {
  constructor(props) {
    super(props);
  }

  onUserInputSubmit = (message) => {
    this.props.onUserInputSubmit(message);
  }

  render() {
    const { currentUser3BoxProfile, currentUserAddr, threadJoined, agentProfile, openThread } = this.props;
    let messageList = this.props.messageList || [];

    let chatWindowClassList = [
      'sc-chat-window',
      ((this.props.isOpen && threadJoined) ? 'opened' : 'closed')
    ];

    let joinThreadWindowClassList = [
      'joinThreadWindow',
      ((this.props.isOpen && !threadJoined) ? 'opened' : 'closed')
    ];

    return (
      <Fragment>
        <div className={joinThreadWindowClassList.join(' ')} onClick={openThread}>
          <div className="joinThreadWindow_wrapper">
            <div className="joinThreadWindow_wrapper_header">
              <h3>{`Join ${agentProfile.teamName}`} </h3>
              <p>Ephemeral threads are P2P and impermanent.</p>
            </div>
            <footer>
              <span className="footer_text">
                Decentralized ghostchat by
                <a href="https://3box.io" target="_blank" rel="noopener noreferrer">
                  <SVG src={Logo} alt="Logo" className="footer_text_image" />
                </a>
              </span>
            </footer>
          </div>
        </div>

        <div className={chatWindowClassList.join(' ')}>
          <Header
            teamName={this.props.agentProfile.teamName}
            imageUrl={this.props.agentProfile.imageUrl}
            onClose={this.props.onClose}
          />
          <MessageList
            messages={messageList}
            imageUrl={this.props.agentProfile.imageUrl}
            currentUserAddr={this.props.currentUserAddr}
            profiles={this.props.profiles}
          />
          <UserInput
            currentUser3BoxProfile={currentUser3BoxProfile}
            currentUserAddr={currentUserAddr}
            onSubmit={this.onUserInputSubmit}
            showEmoji={this.props.showEmoji}
          />
        </div>
      </Fragment>
    );
  }
}

ChatWindow.propTypes = {
  agentProfile: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserInputSubmit: PropTypes.func.isRequired,
  showEmoji: PropTypes.bool
};

export default ChatWindow;
