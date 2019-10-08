import React from 'react';
import Linkify from 'react-linkify';


const TextMessage = (props) => {
  return (
    <div
      className="sc-message--text"
      style={{ backgroundColor: props.isMyComment && props.colorTheme }}
    >
      <Linkify properties={{ target: '_blank' }}>
        {props.message}
      </Linkify>
    </div>
  );
};

export default TextMessage;
