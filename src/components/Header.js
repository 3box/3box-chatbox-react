import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import closeIcon from '../assets/close-icon.png';
import Chat from '../assets/Chat2.svg';

class Header extends Component {

  render() {
    const { imageUrl, chatName, onClose, colorTheme } = this.props;

    return (
      <div className="sc-header" style={{ backgroundColor: colorTheme }}>

        {imageUrl ? <img className="sc-header--img" src={imageUrl} alt="Chat Profile" />
          : <SVG src={Chat} alt="Logo" className="sc-header--img default" />
        }

        <div className="sc-header--team-name"> {chatName} </div>
        <div className="sc-header--close-button" onClick={onClose}>
          <img src={closeIcon} alt="" />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  imageUrl: PropTypes.string,
  chatName: PropTypes.string,
  colorTheme: PropTypes.string,
  onClose: PropTypes.func,
};

export default Header;
