import React from 'react';
import AccountHeader from './AccountHeader';
import './AccountLayout.css';

const AccountLayout = ({ children, currentPage }) => {
  return (
    <div className="account-layout">
      <AccountHeader currentPage={currentPage} />
      <main className="account-main">
        <div className="account-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AccountLayout;
