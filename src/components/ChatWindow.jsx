import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import SVG from 'react-inlinesvg';

import Logo from '../assets/3BoxLogoWhite.svg';
import Loading from '../assets/3BoxCommentsSpinner.svg';
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
    const {
      currentUser3BoxProfile,
      currentUserAddr,
      threadJoined,
      agentProfile,
      openThread,
      threadLoading,
      notPopup
    } = this.props;

    let messageList = this.props.messageList || [];
    let chatWindowClassList;
    let joinThreadWindowClassList;
    // const windowType = notPopup ? 'chat' : 'popupChat';
    if (notPopup) {
      chatWindowClassList = [
        'sc-chat-window',
        // windowType,
        (threadJoined ? 'opened' : 'closed')
      ];

      joinThreadWindowClassList = [
        'joinThreadWindow',
        // windowType,
        (!threadJoined ? 'opened' : 'closed')
      ];
    } else {
      chatWindowClassList = [
        'sc-chat-window',
        // windowType,
        ((this.props.isOpen && threadJoined) ? 'opened' : 'closed')
      ];

      joinThreadWindowClassList = [
        'joinThreadWindow',
        // windowType,
        ((this.props.isOpen && !threadJoined) ? 'opened' : 'closed')
      ];
    }

    return (
      <div className={notPopup ? 'chat' : 'popupChat'}>
        <div className={joinThreadWindowClassList.join(' ')}>
          <div className="joinThreadWindow_wrapper">
            <div className="joinThreadWindow_wrapper_header">
              <h3 className="joinThreadWindow_wrapper_header_title">{`${agentProfile.teamName} Chat`} </h3>
              {/* <p>Ephemeral threads are P2P and impermanent.</p> */}
            </div>

            <button className="joinThreadWindow_wrapper_button" onClick={openThread}>
              Join
            </button>

            {threadLoading && <SVG className="thread_loading" src={Loading} alt="Loading" />}

            {/* <footer>
              <span className="footer_text">
                Decentralized ghostchat by
                <a href="https://3box.io" target="_blank" rel="noopener noreferrer">
                  <SVG src={Logo} alt="Logo" className="footer_text_image" />
                </a>
              </span>
            </footer> */}
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
      </div>
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
