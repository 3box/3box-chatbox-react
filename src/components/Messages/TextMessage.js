import React from 'react';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';

const TextMessage = ({ isMyComment, colorTheme, messageObj }) => (
  <div
    className="sc-message--text"
    style={{ backgroundColor: isMyComment && colorTheme }}
  >
    <Linkify properties={{ target: '_blank' }}>
      {messageObj.message}
    </Linkify>
  </div>
);

TextMessage.propTypes = {
  isMyComment: PropTypes.bool,
  colorTheme: PropTypes.string,
  messageObj: PropTypes.object,
};

export default TextMessage;
