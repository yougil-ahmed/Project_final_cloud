// src/components/Layout/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
        <nav className="sidebar-nav">
            <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
                <Link to="/notes" className="sidebar-link notes">Notes</Link>
            </li>
            <li className="sidebar-menu-item">
                <Link to="/users" className="sidebar-link users">Users</Link>
            </li>
            <li className="sidebar-menu-item">
                <Link to="/modules" className="sidebar-link modules">Modules</Link>
            </li>
            <li className="sidebar-menu-item">
                <Link to="/login" className="sidebar-link login">Login</Link>
            </li>
            <li className="sidebar-menu-item">
                <Link to="/register" className="sidebar-link register">Register</Link>
            </li>
            
            <li className="sidebar-menu-item">
                <Link to="/logout" className="sidebar-link logout">Logout</Link>
            </li>
            </ul>
        </nav>
        </aside>
  );
};

export default Sidebar;
