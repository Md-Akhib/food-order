import React, { useState, useEffect } from 'react';
import './TopSellingItems.css';
import { useAppContext } from '../../Context/AppContext';
import { FaFire, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const TopSellingItems = () => {
    const { navigate, axios, addToCart } = useAppContext();
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingItems, setLoadingItems] = useState({});

    // Fetch top selling items
    useEffect(() => {
        const fetchTopSellingItems = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/api/menu/top-selling');
                if (data.success) {
                    setTopSellingItems(data.topSellingItems);
                }
            } catch (error) {
                console.log('Error fetching top selling items:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSellingItems();
    }, [axios]);

    console.log(topSellingItems);
    

    // Handle add to cart with loading state
    const handleAddToCart = async (e, id) => {
        e.stopPropagation();
        setLoadingItems(prev => ({ ...prev, [id]: true }));
        try {
            await addToCart(id);
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setLoadingItems(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className='container section top-selling-section'>
            <div className='top-selling-header-wrapper'>
                <h1 className='top-selling-header'>
                    <FaFire className='flame-icon' /> Top Selling Items
                </h1>
                <p className='top-selling-subtitle'>Most loved by our customers</p>
            </div>

            {/* Top Selling Items Grid */}
            <div className='top-selling-grid'>
                {loading ? (
                    [...Array(5)].map((_, index) => (
                        <div key={`card-skel-${index}`} className="top-selling-card skeleton-card">
                            <div className="skeleton skeleton-card-img"></div>
                            <div className="skeleton-card-info">
                                <div className="skeleton skeleton-title"></div>
                                <div className="skeleton skeleton-price"></div>
                                <div className="skeleton-action-row">
                                    <div className="skeleton skeleton-rating"></div>
                                    <div className="skeleton skeleton-btn"></div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : topSellingItems && topSellingItems.length > 0 ? (
                    topSellingItems.map((item, index) => {
                        const isItemLoading = loadingItems[item._id];
                        const isDecimal = item.stars % 1 !== 0;
                        const rank = index + 1;

                        return (
                            <div
                                key={item._id}
                                className='top-selling-card'
                                onClick={() => { navigate(`/menu-details/${item._id}`); window.scrollTo(0, 0); }}
                            >
                                {/* Rank Badge */}
                                <div className="rank-badge">#{rank}</div>

                                <div className="card-image-wrapper">
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                </div>

                                <div className="card-content">
                                    <h3 className="item-title">{item.title}</h3>
                                    <p className="item-price">₹{item.price}</p>

                                    <div className="card-actions">
                                        <div className="item-rating">
                                            <span className="single-star-icon">
                                                {isDecimal ? <FaStarHalfAlt /> : <FaStar />}
                                            </span>
                                            <span className="rating-value">{item.stars || '0.0'}</span>
                                        </div>

                                        <button
                                            className={`add-btn ${isItemLoading ? 'loading' : ''}`}
                                            aria-label="Add to cart"
                                            onClick={(e) => handleAddToCart(e, item._id)}
                                            disabled={isItemLoading}
                                        >
                                            {isItemLoading ? <span className="btn-spinner"></span> : '+'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-items-message">
                        <p>No top selling items available yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopSellingItems;