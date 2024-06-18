import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { get } from '../api/functions';
import API from '../api/endpoints';

export default function Course() {
  const { id } = useParams();
  const [courseInfo, setCourseInfo] = useState({});
  const [teacherInfo, setTeacherInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fecthCourseInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fecthCourseInfo = async () => {
    get(API.GET_COURSE(id))
      .then(data => {
        setCourseInfo(data.course);
        fetchTeacherInfo(data.course.userId);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }
  
  const fetchTeacherInfo = async (userId) => {
    get(API.GET_USER(userId))
      .then(data => {
        setTeacherInfo(data.user);
      })
      .catch(err => {
        console.error(err);
      });
  }

  return (
    isLoading 
      ?
        <div className="flex items-center justify-center min-h-screen bg-cover">
          <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <p>Loading...</p>
          </div>
        </div>
      : courseInfo ?
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
          <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h1 className="text-2xl font-bold text-center">{courseInfo.name}</h1>
            <p className="text-center text-gray-500">Profesor: {teacherInfo.firstName} {teacherInfo.lastName}</p>
            {/* <div>Semana del {currentWeek ? `${formatDate(currentWeek.start)} - ${formatDate(currentWeek.end)}` : "Cargando..."}</div>
            <div className="grid grid-cols-7 gap-0.5">
              {Object.keys(availabilitiesByDay).map((day, index) => (
                <div key={index} className="bg-white-200 text-center py-4">{day}</div>
              ))}
              <div className="bg-gray-500 h-1 col-span-7"></div>
              
              {Object.entries(availabilitiesByDay).map(([day, hours], index) => (
                <div key={index} className="bg-white-200 flex flex-col items-center py-4">
                  {hours.map((hour, indexHour) => (
                    <div key={indexHour} className="bg-gray-200 text-center py-2 px-4 rounded-full m-1 cursor-pointer" style={{ width: '130px' }} onClick={() => handleClickOpenModalEdit(hour, day)}>
                      {hour.startTime.slice(0, 5)} - {hour.endTime.slice(0, 5)}
                    </div>
                  ))}
                  <img onClick={() => handleClickOpenModal(day)} src={plus} alt="Agregar horario" className="w-7 h-7" /> 
                </div>
              ))}
            </div> */}
          </div>
        </div>
        : null
  );
}