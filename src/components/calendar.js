import React, { useState, useEffect } from 'react';
import { daysOfWeekNumber, numberForDays } from '../config';
import PropTypes from 'prop-types';
import plus from '../assets/images/plus.png';

function Calendar({ availabilities, canEdit, functionClickOnTime, functionClickAdd }) {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(null);
  const availabilitiesByDay = {'Lu': [], 'Ma': [], 'Mi': [], 'Ju': [], 'Vi': [], 'Sa': [], 'Do': []};

  useEffect(() => {
    getStartAndEndDateOfWeek();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  const formatDateYearFirst = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  function getStartAndEndDateOfWeek() {
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek + 7);

    setCurrentWeek({ start: monday, end: sunday });
  }
  
  // Filtro y orden de las horas por días de semana
  const filteredAvailabilities = availabilities.filter(availability => {
    if (currentWeek) {
      return availability.date >= formatDateYearFirst(currentWeek.start) && availability.date <= formatDateYearFirst(currentWeek.end);
    }
    return null;
  });

  filteredAvailabilities.forEach(availability => {
    const [year, month, day] = availability.date.split('-');
    const date = new Date(year, month - 1, day);
    const dayOfWeek = numberForDays[date.getDay()];
    availabilitiesByDay[dayOfWeek].push(availability);
  });

  Object.keys(availabilitiesByDay).forEach(day => {
    availabilitiesByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  const getDate = (selectedDay) => {
    const numberDay = daysOfWeekNumber[selectedDay];
    const selectedDate = new Date(currentWeek.start.getTime());
    selectedDate.setDate(selectedDate.getDate() + numberDay);
    const year = selectedDate.getFullYear();
    const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + selectedDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  const handleClickOnTime = (hour, day) => {
    if (hasHourPassed(hour, day)) return;
    if (!hour.isAvailable && !canEdit) return;
    functionClickOnTime(hour, day, getDate(day))
  }

  const hasHourPassed = (hour, day) =>{
    return new Date() > new Date(`${getDate(day)}T${hour.startTime}`);
  }

  const isGray = (hour, day) => {
    return hasHourPassed(hour, day) || hour.isAvailable === false;
  }

  return (
    <div>
      <div>Semana del {currentWeek ? `${formatDate(currentWeek.start)} - ${formatDate(currentWeek.end)}` : "Cargando..."}</div>
      <div className="grid grid-cols-7 gap-0.5">
        {Object.keys(availabilitiesByDay).map((day, index) => (
          <div key={index} className="bg-white-200 text-center py-4">{day}</div>
        ))}
        <div className="bg-gray-500 h-1 col-span-7"></div>
        
        {Object.entries(availabilitiesByDay).map(([day, hours], index) => (
          <div key={index} className="bg-white-200 flex flex-col items-center py-4">
            {hours.map((hour, indexHour) => (
              <div key={indexHour} 
              className={`py-2 px-4 rounded-full m-1 text-xs ${!isGray(hour, day)? 'bg-gray-200 shadow cursor-pointer' : 'bg-gray-100'}`}
              style={{ width: '101px', color: !isGray(hour, day) ? 'black' : 'gray'}} 
              onClick={() => handleClickOnTime(hour, day)}
              >
                {hour.startTime.slice(0, 5)} - {hour.endTime.slice(0, 5)}
              </div>
            ))}
            {canEdit 
              ? <img onClick={() => functionClickAdd(day, getDate(day), availabilitiesByDay)} src={plus} alt="Agregar horario" className="w-7 h-7" /> 
              : null
            }
          </div>

        ))}
      </div>
    </div>
  );
}

Calendar.propTypes = {
  availabilities: PropTypes.array.isRequired,
  canEdit: PropTypes.bool.isRequired,
  functionClickOnTime: PropTypes.func,
  functionClickAdd: PropTypes.func,
};

export default Calendar;