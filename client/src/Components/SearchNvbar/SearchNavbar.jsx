import React, { useState } from 'react';
import './SearchNavbar.css';
import { useAppContext } from '../../Context/AppContext';
import { IoArrowBack } from 'react-icons/io5';
import toast from 'react-hot-toast';

const SearchNavbar = () => {

    const { search, setSearch, axios, setSearchedMenu, navigate } = useAppContext();

    const [loading, setLoading] = useState(false);

    const handleHomeClick = () => {
        navigate('/');
        setSearch("");
        setSearchedMenu([])
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("function called");

        // Prevent empty searches
        if (!search.trim()) return;

        setLoading(true);
        try {
            const { data } = await axios.post('/api/menu/search', { search });
            if (data.success) {
                setSearchedMenu(data.menuitems);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="search-nav-header">
            <div className='search-nav-container container'>

                {/* Back Button */}
                <button
                    className="search-nav-back-btn"
                    onClick={handleHomeClick}
                    title="Go Back"
                >
                    <IoArrowBack size={24} />
                </button>

                {/* Search Form */}
                <form className="search-nav-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="search-nav-input"
                        placeholder="Search for food..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        required
                    />
                    <button type='submit' className="search-nav-btn" disabled={loading}>
                        {loading ? (
                            <span className="search-btn-spinner"></span>
                        ) : (
                            "Search"
                        )}
                    </button>
                </form>

            </div>
        </header>
    );
}

export default SearchNavbar;