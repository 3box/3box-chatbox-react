import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import SVG from 'react-inlinesvg';
import Tilt from 'react-tilt';
import TextLoop from "react-text-loop";

import Chat from '../assets/Chat2.svg';
import Logo from '../assets/3BoxLogo.svg';
import Loading from '../assets/3BoxCommentsSpinner.svg';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';
import LoadingAnimation from './LoadingAnimation';

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
      notPopup,
      onClose,
      profiles,
      showEmoji,
      colorTheme,
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

    return (
      <div className={notPopup ? 'chat' : 'popupChat'}>
        <div className={joinThreadWindowClassList.join(' ')}>
          <div className="joinThreadWindow_wrapper">

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
                {`${agentProfile.teamName} Chat`}
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
              <Tilt options={options}>
                <button
                  className={`joinThreadWindow_wrapper_button  ${threadLoading ? '' : 'show'}`}
                  onClick={openThread}
                  style={{ backgroundColor: colorTheme }}
                >
                  Join
                </button>
              </Tilt>

              <LoadingAnimation colorTheme={colorTheme} threadLoading={threadLoading} />
            </div>


            {/* {threadLoading && <SVG className="thread_loading" src={Loading} alt="Loading" />} */}

            <footer>
              <span className="footer_text">
                Decentralized chat by
                <a href="https://docs.3box.io" target="_blank" rel="noopener noreferrer">
                  <SVG src={Logo} alt="Logo" className="footer_text_image" />
                </a>
              </span>
            </footer>
          </div>
        </div>

        <div className={chatWindowClassList.join(' ')}>
          <Header
            teamName={agentProfile.teamName}
            imageUrl={agentProfile.imageUrl}
            onClose={onClose}
            colorTheme={colorTheme}
          />
          <MessageList
            messages={messageList}
            imageUrl={agentProfile.imageUrl}
            currentUserAddr={currentUserAddr}
            profiles={profiles}
            colorTheme={colorTheme}
          />
          <UserInput
            currentUser3BoxProfile={currentUser3BoxProfile}
            currentUserAddr={currentUserAddr}
            onSubmit={this.onUserInputSubmit}
            showEmoji={showEmoji}
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
