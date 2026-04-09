import React, { useState } from 'react';
import './Search.css';
import { useAppContext } from '../../Context/AppContext';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Search = () => {
  const { search, searchedMenu, navigate, addToCart, emptySearch } = useAppContext();

  const [loadingItems, setLoadingItems] = useState({});

  if (searchedMenu.length === 0) {
    return <div className='empty-search-container'></div>;
  }

  // 2. Added the handleAddToCart function missing from the original code
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
    <div className='container section'>
      <h1 className='search-title'>Showing results for: "{search}"</h1>
      <div className='menu-grid search-menu-grid'>
        {searchedMenu?.map((menu, index) => {
          const isDecimal = menu.stars % 1 !== 0;
          // 4. Defined isItemLoading inside the loop
          const isItemLoading = loadingItems[menu._id];

          return (
            <div
              key={index}
              className='menu-card'
              onClick={() => { navigate(`/menu-details/${menu._id}`); window.scrollTo(0, 0); }}
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
        })}
      </div>
    </div>
  );
}

export default Search;