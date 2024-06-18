import React, { useState } from 'react';
import PropTypes from 'prop-types';
import arrowDown from '../assets/images/arrow-down.png';

const Dropdown = ({ placeholder, options, optionsSelected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (optionsSelected) {
      if (isNotAvailable(option)) {
        return;
      }
    }
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(option =>
    (typeof option === 'string')
      ? option.toLowerCase().includes(searchTerm.toLowerCase())
      : `${option.startTime} - ${option.endTime}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isNotAvailable = (option) => {
    return optionsSelected.some(optionSelected => {
      return optionSelected.startTime.slice(0, 5) === option.startTime && optionSelected.endTime.slice(0, 5) === option.endTime;
    });
  };

  const optionFormat = (option) => {
    if (typeof option === 'string') {
      return option;
    } else {
      return `${option.startTime} - ${option.endTime}`;
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:bg-gray-700 shadow-md flex items-center justify-between w-64 h-12"
        style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
      >
        <span className="mr-auto">{selectedOption ? optionFormat(selectedOption) : placeholder}</span>
        <img
          src={arrowDown}
          alt="Flecha hacia abajo"
          className={`ml-2 w-5 h-5 transform ${isOpen ? 'rotate-180' : ''}`}
        /> 
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-4 py-2 text-gray-800 focus:outline-none"
          />
          <ul className="py-1">
            {filteredOptions.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleOptionClick(option)}
                  className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200 focus:outline-none"
                  style={{ color: optionsSelected && isNotAvailable(option) ? '#A1A0A0' : '#4D4D4D' }}
                >
                  {optionFormat(option)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  optionsSelected: PropTypes.array,
  onSelect: PropTypes.func.isRequired 
};

export default Dropdown;
