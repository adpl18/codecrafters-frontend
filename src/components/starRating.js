import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index) => {
    onRatingChange(index);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          index={index}
          rating={hoverRating || rating}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

const Star = ({ index, rating, onMouseEnter, onMouseLeave, onClick }) => {
  const isFilled = index <= rating;
  return (
    <svg
      className={`w-6 h-6 cursor-pointer ${isFilled ? 'text-yellow-500' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.19c.969 0 1.371 1.24.588 1.81l-3.395 2.464a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.395-2.464a1 1 0 00-1.176 0l-3.395 2.464c-.784.57-1.84-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.24 9.397c-.783-.57-.38-1.81.588-1.81h4.19a1 1 0 00.95-.69l1.286-3.97z" />
    </svg>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

Star.propTypes = {
  index: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StarRating;
