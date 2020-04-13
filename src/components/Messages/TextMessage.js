import React from 'react';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';

const TextMessage = ({ isMyComment, colorTheme, messageObj }) => (
  <div
    className="sc-message--text"
    style={{ backgroundColor: isMyComment && colorTheme ? colorTheme : {}}}
  >
    <Linkify properties={{ target: '_blank' }}>
      {messageObj.message}
    </Linkify>
  </div>
);

TextMessage.propTypes = {
  isMyComment: PropTypes.bool,
  colorTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  messageObj: PropTypes.object,
};

export default TextMessage;
