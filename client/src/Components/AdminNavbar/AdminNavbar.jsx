import React from 'react';
import './AdminNavbar.css';
import { useAppContext } from '../../Context/AppContext';
import logo from '../../assets/logo.png'
import toast from 'react-hot-toast';

const AdminNavbar = () => {
    const { navigate, setIsAdmin, axios } = useAppContext();

    const handleLogout = async () => {
        try {
            const { data } = await axios.post('/api/admin/logout')
            if (data.success) {
                setIsAdmin(false);
                navigate('/admin');
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div className='admin-navbar'>
            <div className="admin-nav-left" onClick={() => navigate('/')}>
                <img src={logo} alt="" />
            </div>

            <div className="admin-nav-center">
                <h4>Admin Panel</h4>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default AdminNavbar;