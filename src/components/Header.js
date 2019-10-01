import React, { Component } from 'react';
import closeIcon from '../assets/close-icon.png';


class Header extends Component {

  render() {
    const { imageUrl, teamName, onClose } = this.props;
    return (
      <div className="sc-header">

        {imageUrl ? (
          <img className="sc-header--img" src={imageUrl} alt="Chat Profile" />
        ) : <p className="sc-header--img ghost">👻</p>
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
