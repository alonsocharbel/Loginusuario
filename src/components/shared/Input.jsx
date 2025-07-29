import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  label,
  error,
  helper,
  required = false,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const inputId = props.id || props.name;
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        className={`form-input ${error ? 'form-input-error' : ''} ${inputClassName}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
        {...props}
      />
      
      {helper && !error && (
        <p id={`${inputId}-helper`} className="form-helper">
          {helper}
        </p>
      )}
      
      {error && (
        <p id={`${inputId}-error`} role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
