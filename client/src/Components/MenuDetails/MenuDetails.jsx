import React, { useState, useEffect } from 'react';
import './MenuDetails.css';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const MenuDetails = () => {
    const { id } = useParams();
    const { menuitem, addToCart } = useAppContext();

    // States
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false); // New state for button loader

    useEffect(() => {
        if (menuitem && menuitem.length > 0) {
            setLoading(false);
        }
    }, [menuitem]);

    const menu = menuitem?.find(item => item._id === id);

    const renderStars = (stars) => {
        const validStars = stars || 0;
        return Array.from({ length: 5 }, (_, index) => {
            let halfNumber = index + 0.5;
            return (
                <span key={index} className="md-star-icon">
                    {validStars >= index + 1 ? (
                        <FaStar />
                    ) : validStars >= halfNumber ? (
                        <FaStarHalfAlt />
                    ) : (
                        <FaRegStar />
                    )}
                </span>
            );
        });
    };

    // --- NEW: Wrapper function to handle the async cart loading state ---
    const handleAddToCart = async () => {
        setIsAdding(true);
        await addToCart(menu._id);
        setIsAdding(false);
    };

    if (loading) {
        return (
            <div className='md-container'>
                <div className='md-layout-grid'>
                    <div className='md-img-col'>
                        <div className='md-shimmer md-skeleton-img'></div>
                    </div>
                    <div className='md-info-col'>
                        <div className='md-shimmer md-skeleton-tag'></div>
                        <div className='md-shimmer md-skeleton-title'></div>
                        <div className='md-shimmer md-skeleton-rating'></div>
                        <div className='md-shimmer md-skeleton-price'></div>
                        <div className='md-shimmer md-skeleton-btn'></div>
                        <div className='md-shimmer md-skeleton-desc'></div>
                        <div className='md-shimmer md-skeleton-desc short'></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className='md-container md-error-state'>
                <h2>Item not found</h2>
                <Link to="/menu" className="md-back-link">Return to Menu</Link>
            </div>
        );
    }

    return (
        <div className='md-container'>
            <div className='md-layout-grid'>

                <div className='md-img-col'>
                    <div className="md-png-backdrop">
                        <img src={menu.image} alt={menu.title} className="md-main-img" />
                    </div>
                </div>

                <div className='md-info-col'>
                    <span className='md-category-tag'>{menu.category}</span>
                    <h1 className='md-title'>{menu.title}</h1>

                    <div className="md-rating-row">
                        <div className="md-stars">
                            {renderStars(menu.stars)}
                        </div>
                        <span className="md-rating-number">
                            {menu.stars ? menu.stars.toFixed(1) : "0.0"}
                        </span>
                        <span className="md-review-count">
                            ({menu.reviews?.length || 0} reviews)
                        </span>
                    </div>

                    <div className="md-price-row">
                        <span className="md-price">₹{menu.price}</span>
                        <span className={`md-stock-status ${menu.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {menu.inStock ? '● In Stock' : '● Out of Stock'}
                        </span>
                    </div>

                    <div className="md-action-area">
                        <button
                            className='md-cart-button'
                            disabled={!menu.inStock || isAdding} // Disable while adding
                            onClick={handleAddToCart}
                        >
                            {/* Display loader or text based on state */}
                            {isAdding ? (
                                <span className="md-btn-loader"></span>
                            ) : (
                                menu.inStock ? 'Add To Cart' : 'Currently Unavailable'
                            )}
                        </button>
                    </div>

                    <div className="md-description-area">
                        <h3>About this item</h3>
                        <p>{menu.description}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MenuDetails;