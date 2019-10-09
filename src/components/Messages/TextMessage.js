import React from 'react';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';

const TextMessage = ({ isMyComment, colorTheme, message }) => (
  <div
    className="sc-message--text"
    style={{ backgroundColor: isMyComment && colorTheme }}
  >
    <Linkify properties={{ target: '_blank' }}>
      {message}
    </Linkify>
  </div>
);

TextMessage.propTypes = {
  isMyComment: PropTypes.bool,
  colorTheme: PropTypes.string,
  message: PropTypes.string,
};

export default TextMessage;
