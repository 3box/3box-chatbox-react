import React from 'react';
import PropTypes from 'prop-types';

import '../styles/LoadingAnimation.scss';

const LoadingAnimation = ({ colorTheme, threadLoading }) => (
  <div style={colorTheme ? { color: colorTheme } : {}} className={`la-ball-pulse-sync ${threadLoading ? 'threadLoading' : ''}`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

LoadingAnimation.propTypes = {
  colorTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  threadLoading: PropTypes.bool
};

export default LoadingAnimation;