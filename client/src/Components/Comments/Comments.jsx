import React, { useState } from 'react';
import './Comments.css';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';
import { ImStarEmpty } from "react-icons/im";
import { TiStarFullOutline } from "react-icons/ti";
import toast from 'react-hot-toast';

const Comments = () => {
  const { id } = useParams();
  // Assuming fetchMenuItems is your function to refresh context data after a review
  const { menuitem, user, axios, fetchMenuItems } = useAppContext();

  // --- State Management ---
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find specific menu item
  const menu = menuitem?.find(item => item._id === id);

  if (!menu) {
    return <div className="container section"><h2>Loading comments...</h2></div>;
  }

  const reviews = menu.reviews || [];

  // --- Pagination Logic ---
  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (reviewText.trim() === "") {
      toast.error("Please write a review.");
      return;
    }
    if (!user) {
      setRating(0);
      setReviewText("");
      toast.error("You must be logged in to submit a review.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Adjust the API route to match your actual backend route for menu reviews
      const { data } = await axios.post('/api/menu/review', {
        userId: user._id,
        menuId: menu._id, // Updated from bookId to menuId based on your backend ref
        rating: rating,
        review: reviewText
      });

      if (data.success) {
        toast.success(data.message);
        if (fetchMenuItems) await fetchMenuItems(); // Refresh global state
        setRating(0);
        setReviewText("");
        // Go to the last page where the new review will appear
        setCurrentPage(Math.ceil((reviews.length + 1) / reviewsPerPage));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container section comments-section'>
      <h2 className='comments-title'>Reviews ({reviews.length})</h2>

      {/* --- Review Submission Form --- */}
      <div className='review-form-container'>
        <h3>Write a Review</h3>
        <form onSubmit={handleReviewSubmit} className='review-form'>

          {/* Interactive Star Rating using your requested icons */}
          <div className="interactive-stars">
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <label key={index} className="star-label">
                  <input
                    type="radio"
                    name="rating"
                    value={currentRating}
                    onClick={() => setRating(currentRating)}
                    style={{ display: 'none' }}
                  />
                  {currentRating <= rating ? (
                    <TiStarFullOutline className="star-icon filled" />
                  ) : (
                    <ImStarEmpty className="star-icon empty" />
                  )}
                </label>
              );
            })}
          </div>

          <textarea
            className="review-textarea"
            placeholder="What did you think about this dish?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            disabled={isSubmitting}
          ></textarea>

          <button
            type="submit"
            className="submit-review-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="btn-loader"></span> : "Submit Review"}
          </button>
        </form>
      </div>

      {/* --- Display Existing Reviews --- */}
      <div className='reviews-list-container'>
        {reviews.length > 0 ? (
          currentReviews.map((reviewItem, index) => (
            <div key={index} className='review-card'>
              <div className='review-header'>

                {/* Avatar */}
                {reviewItem.userId?.image ? (
                  <img
                    src={reviewItem.userId.image}
                    alt={reviewItem.userId?.name}
                    className='reviewer-image'
                  />
                ) : (
                  <div className='reviewer-avatar-fallback'>
                    {reviewItem.userId?.name ? reviewItem.userId.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <div className='reviewer-info'>
                  <h4 className='reviewer-name'>
                    {reviewItem.userId?.name || "Anonymous User"}
                  </h4>

                  {/* Static Display Stars */}
                  <div className='static-stars'>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < reviewItem.rating ? (
                          <TiStarFullOutline className="static-star filled" />
                        ) : (
                          <ImStarEmpty className="static-star empty" />
                        )}
                      </span>
                    ))}
                  </div>

                  <span className='review-date'>
                    {reviewItem.date
                      ? new Date(reviewItem.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                      : "Recent"}
                  </span>
                </div>
              </div>

              <div className='review-body'>
                <p>{reviewItem.review}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-reviews-msg">No reviews yet. Be the first to review this item!</p>
        )}
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Prev
          </button>

          <span className="page-info">Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Comments;