import PropTypes from 'prop-types';
import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import SVG from 'react-inlinesvg';

import SendIcon from './icons/SendIcon';
import EmojiIcon from './icons/EmojiIcon';
import PopupWindow from './popups/PopupWindow';
import EmojiPicker from './emoji-picker/EmojiPicker';
import Profile from '../assets/Profile.svg';

class UserInput extends Component {
  constructor() {
    super();
    this.state = {
      inputActive: false,
      inputHasText: false,
      emojiPickerIsOpen: false,
      emojiFilter: ''
    };
  }

  componentDidMount() {
    this.emojiPickerButton = document.querySelector('#sc-emoji-picker-button');
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this._submitText(event);
    }
  }

  handleKeyUp(event) {
    const inputHasText = event.target.innerHTML.length !== 0 &&
      event.target.innerText !== '\n';
    this.setState({ inputHasText });
  }

  _showFilePicker() {
    this._fileUploadButton.click();
  }

  toggleEmojiPicker = (e) => {
    e.preventDefault();
    if (!this.state.emojiPickerIsOpen) {
      this.setState({ emojiPickerIsOpen: true });
    }
  }

  closeEmojiPicker = (e) => {
    if (this.emojiPickerButton.contains(e.target)) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ emojiPickerIsOpen: false });
  }

  _submitText(event) {
    event.preventDefault();
    const text = this.userInput.textContent;
    if (text && text.length > 0) {
      this.props.onSubmit({
        author: 'me',
        type: 'text',
        data: { text }
      });
      this.userInput.innerHTML = '';
    }
  }

  _handleEmojiPicked = (emoji) => {
    this.setState({ emojiPickerIsOpen: false });
    if (this.state.inputHasText) {
      this.userInput.innerHTML += emoji;
    } else {
      this.props.onSubmit({
        author: 'me',
        type: 'text',
        data: { text: emoji }
      });
    }
  }

  handleEmojiFilterChange = (event) => {
    const emojiFilter = event.target.value;
    this.setState({ emojiFilter });
  }

  _renderEmojiPopup = () => (
    <PopupWindow
      isOpen={this.state.emojiPickerIsOpen}
      onClickedOutside={this.closeEmojiPicker}
      onInputChange={this.handleEmojiFilterChange}
    >
      <EmojiPicker
        onEmojiPicked={this._handleEmojiPicked}
        filter={this.state.emojiFilter}
      />
    </PopupWindow>
  )

  render() {
    const { emojiPickerIsOpen, inputActive } = this.state;
    const { currentUser3BoxProfile, currentUserAddr } = this.props;

    const updatedProfilePicture = currentUser3BoxProfile.image ? `https://ipfs.infura.io/ipfs/${currentUser3BoxProfile.image[0].contentUrl['/']}`
      : currentUserAddr && makeBlockie(currentUserAddr);

    return (
      <form className={`sc-user-input ${(inputActive ? 'active' : '')}`}>
        {updatedProfilePicture ? (
          <img
            src={updatedProfilePicture}
            alt="Profile"
            className="input_user"
          />
        ) : (
            <div className="input_emptyUser">
              <SVG
                src={Profile}
                alt="Profile"
                className="input_emptyUser_icon"
              />
            </div>
          )}
        <div
          role="button"
          tabIndex="0"
          onFocus={() => { this.setState({ inputActive: true }); }}
          onBlur={() => { this.setState({ inputActive: false }); }}
          ref={(e) => { this.userInput = e; }}
          onKeyDown={this.handleKeyDown.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
          contentEditable="true"
          placeholder="Write a reply..."
          className="sc-user-input--text"
        >
        </div>
        <div className="sc-user-input--buttons">
          <div className="sc-user-input--button"></div>
          <div className="sc-user-input--button">
            {this.props.showEmoji && <EmojiIcon
              onClick={this.toggleEmojiPicker}
              isActive={emojiPickerIsOpen}
              tooltip={this._renderEmojiPopup()}
            />}
          </div>
          {this.state.inputHasText && (
            <div className="sc-user-input--button">
              <SendIcon onClick={this._submitText.bind(this)} />
            </div>
          )}
        </div>
      </form>
    );
  }
}

UserInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  showEmoji: PropTypes.bool
};

export default UserInput;
