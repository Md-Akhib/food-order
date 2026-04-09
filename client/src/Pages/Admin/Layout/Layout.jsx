import React from 'react';
import AdminNavbar from '../../../Components/AdminNavbar/AdminNavbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import './Layout.css'

const Layout = () => {
  return (
    <div className="admin-layout container">
      <AdminNavbar />
      <div className="admin-layout-body">
        <Sidebar />
        <div className="admin-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;