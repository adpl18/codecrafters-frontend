import React from 'react';
import PropTypes from 'prop-types';

const ToggleButton = ({ isTeacherView, toggleView }) => {
  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={() => toggleView(true)}
        className={`py-2 px-4 font-bold rounded-full focus:outline-none focus:shadow-outline mx-2 ${isTeacherView ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
      >
        Vista Profesor
      </button>
      <button
        onClick={() => toggleView(false)}
        className={`py-2 px-4 font-bold rounded-full focus:outline-none focus:shadow-outline mx-2 ${!isTeacherView ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
      >
        Vista Estudiante
      </button>
    </div>
  );
};

ToggleButton.propTypes = {
  isTeacherView: PropTypes.bool.isRequired,
  toggleView: PropTypes.func.isRequired,
};

export default ToggleButton;

