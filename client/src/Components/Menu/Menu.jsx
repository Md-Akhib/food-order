import React, { useState, useEffect } from 'react';
import './Menu.css';
import { useAppContext } from '../../Context/AppContext';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Menu = () => {
  const { menuitem, categories, navigate, addToCart } = useAppContext();

  const [selectCategory, setSelectCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // State to track which buttons are currently in a loading state
  const [loadingItems, setLoadingItems] = useState({});

  useEffect(() => {
    if (categories?.length > 0 && menuitem?.length > 0) {
      setLoading(false);
    }
  }, [categories, menuitem]);

  const filteredMenu = selectCategory === 'All'
    ? menuitem
    : menuitem?.filter(item => item.category === selectCategory);

  // Wrapper function to handle adding to cart with loader and stopping propagation
  const handleAddToCart = async (e, id) => {
    e.stopPropagation(); // Prevents the card onClick (navigation) from firing

    // Set this specific item's loading state to true
    setLoadingItems(prev => ({ ...prev, [id]: true }));

    try {
      await addToCart(id);
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className='container section menu-section'>
      <h1 className='menu-header'>Our Menu</h1>

      {/* Categories Section */}
      <div className='categories-container'>
        <div className='categories-wrapper'>
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div key={`cat-skel-${index}`} className="category-item skeleton-category">
                <div className="skeleton skeleton-cat-img"></div>
                <div className="skeleton skeleton-cat-text"></div>
              </div>
            ))
          ) : (
            <>
              <div
                className={`category-item ${selectCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectCategory('All')}
              >
                <div className="category-image-box">
                  <span>🍽️</span>
                </div>
                <h4>All</h4>
              </div>

              {categories?.map((cat, index) => (
                <div
                  key={index}
                  className={`category-item ${selectCategory === cat.title ? 'active' : ''}`}
                  onClick={() => setSelectCategory(cat.title)}
                >
                  <div className="category-image-box">
                    <img src={cat.image} alt={cat.title} />
                  </div>
                  <h4>{cat.title}</h4>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Menu Cards Section */}
      <div className='menu-grid'>
        {loading ? (
          [...Array(5)].map((_, index) => (
            <div key={`card-skel-${index}`} className="menu-card skeleton-card">
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
        ) : (
          filteredMenu?.map((menu, index) => {
            const isDecimal = menu.stars % 1 !== 0;
            const isItemLoading = loadingItems[menu._id];

            return (
              <div
                key={index}
                className='menu-card'
                onClick={() => { navigate(`/menu-details/${menu._id}`); scrollTo(0, 0) }}
              >
                <div className="card-image-wrapper">
                  <img src={menu.image} alt={menu.title} loading="lazy" />
                </div>

                <div className="card-content">
                  <h3 className="item-title">{menu.title}</h3>
                  <p className="item-price">₹{menu.price}</p>

                  <div className="card-actions">
                    <div className="item-rating">
                      {/* Display only ONE star based on the decimal check */}
                      <span className="single-star-icon">
                        {isDecimal ? <FaStarHalfAlt /> : <FaStar />}
                      </span>
                      <span className="rating-value">{menu.stars}</span>
                    </div>

                    <button
                      className={`add-btn ${isItemLoading ? 'loading' : ''}`}
                      aria-label="Add to cart"
                      onClick={(e) => handleAddToCart(e, menu._id)}
                      disabled={isItemLoading}
                    >
                      {isItemLoading ? <span className="btn-spinner"></span> : '+'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Menu;