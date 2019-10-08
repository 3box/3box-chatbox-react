import React from 'react';

import '../styles/LoadingAnimation.scss';

const LoadingAnimation = ({ colorTheme, threadLoading }) => (
  <div style={{ color: colorTheme }} className={`la-ball-pulse-sync ${threadLoading ? 'threadLoading' : ''}`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

export default LoadingAnimation;
