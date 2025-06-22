// src/components/Layout/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="layout">
        <Navbar />
        <div className="layout-body">
            <Sidebar />
            <main className="layout-main">
            <div className="layout-content">
                {children}
            </div>
            </main>
        </div>
        </div>
  );
};

export default Layout;
