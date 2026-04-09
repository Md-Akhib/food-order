import React from 'react';
import './Sidebar.css';
import {
  MdOutlineDashboard,
  MdAddBox,
  MdOutlineInventory2,
  MdOutlineWallpaper,
  MdOutlineApps,
  MdOutlineNotifications // <-- Imported the new notification icon
} from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import { FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='sidebar'>
      <Link to='/admin' className={location.pathname === '/admin' ? 'active' : ''}>
        <MdOutlineDashboard /> Dashboard
      </Link>
      <Link to='/admin/hero-section' className={location.pathname === '/admin/hero-section' ? 'active' : ''}>
        <MdOutlineWallpaper /> Hero Section
      </Link>
      <Link to='/admin/add-category' className={location.pathname === '/admin/add-category' ? 'active' : ''}>
        <MdOutlineApps /> Add Category
      </Link>
      <Link to="/admin/add-menuitem" className={location.pathname === '/admin/add-menuitem' ? 'active' : ''}>
        <MdAddBox /> Add Menu Item
      </Link>
      <Link to="/admin/all-menuitems" className={location.pathname === '/admin/all-menuitems' ? 'active' : ''}>
        <MdOutlineInventory2 /> All Menu Items
      </Link>
      <Link to="/admin/all-orders" className={location.pathname === '/admin/all-orders' ? 'active' : ''}>
        <FaClipboardList /> Orders
      </Link>
      <Link to="/admin/notification" className={location.pathname === '/admin/notification' ? 'active' : ''}>
        <MdOutlineNotifications /> Notification {/* <-- Applied the new icon here */}
      </Link>
    </div>
  );
};

export default Sidebar;