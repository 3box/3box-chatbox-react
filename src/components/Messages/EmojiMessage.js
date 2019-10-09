import React from 'react';
import PropTypes from 'prop-types';

const EmojiMessage = ({ message }) => (
  <div className="sc-message--emoji">
    {message}
  </div>
);

EmojiMessage.propTypes = {
  message: PropTypes.string,
};

export default EmojiMessage;
