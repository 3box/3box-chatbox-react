import React, { Component } from 'react';
import SVG from 'react-inlinesvg';

import closeIcon from '../assets/close-icon.png';
import Chat from '../assets/Chat2.svg';

class Header extends Component {

  render() {
    const { imageUrl, teamName, onClose } = this.props;
    return (
      <div className="sc-header">

        {imageUrl ? (
          <img className="sc-header--img" src={imageUrl} alt="Chat Profile" />
        ) : <SVG src={Chat} alt="Logo" className="sc-header--img default" />
        }

        <div className="sc-header--team-name"> {teamName} </div>
        <div className="sc-header--close-button" onClick={onClose}>
          <img src={closeIcon} alt="" />
        </div>
      </div>
    );
  }
}

export default Header;
