import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`loader loader-${size} ${className}`}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
