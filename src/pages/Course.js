import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { get } from '../api/functions';
import API from '../api/endpoints';
import Calendar from '../components/calendar';
import Modal from 'react-modal';
import { daysOfWeekCompleteName } from '../config';

export default function Course() {
  const { id } = useParams();
  const [courseInfo, setCourseInfo] = useState({});
  const [teacherInfo, setTeacherInfo] = useState({});
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFormattedDate, setSelectedFormattedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({});

  useEffect(() => {
    fecthCourseInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fecthCourseInfo = async () => {
    get(API.GET_COURSE(id))
      .then(data => {
        setCourseInfo(data.course);
        fetchTeacherInfo(data.course.userId);
        fetchAvailabilities(data.course.userId);
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

  const fetchAvailabilities = async (userId) => {
    get(API.GET_AVAILABILITIES_USER(userId))
      .then(data => {
        setAvailabilities(data.availabilities);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  const handleClickOnTime = (time, day, formattedDate) => {
    setSelectedFormattedDate(formattedDate);
    setSelectedDay(day);
    setSelectedTimeRange(time);
    setIsModalOpen(true);
  };

  const handleClickReserve = () => {
    setIsModalOpen(false);
    console.log(selectedFormattedDate)
  }
  
  return (
    isLoading 
      ?
        <div className="flex items-center justify-center min-h-screen bg-cover">
          <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <p>Loading...</p>
          </div>
        </div>
      :
      <div>
        {courseInfo 
        ?
          <div className="flex justify-center m-10">
            <div className="bg-white p-10 rounded-lg shadow-xl w-full">
              <h1 className="text-2xl font-bold text-center">{courseInfo.name}</h1>
              <p className="text-center text-gray-500">Profesor: {teacherInfo.firstName} {teacherInfo.lastName}</p>
              <div className="flex justify-center mt-8">
                <div className="w-full md:w-3/4">
                  {availabilities.length > 0 
                    ? <Calendar availabilities={availabilities} canEdit={false} functionClickOnTime={handleClickOnTime} />
                    : "Cargando..."
                  }
                </div>
              </div>
            </div>
          </div>
        : null}    
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Editar horario"
          ariaHideApp={false}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              width: '50%',
              height: '40%',
              margin: 'auto',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
            }
          }}
        >
          <div className="p-4">
            <h1 className="text-center 2xl:text-lg:text-4xl sm:text-3xl space-y-4 drop-shadow-2xl text-slate-900 shadow-black">
              Horario seleccionado: {daysOfWeekCompleteName[selectedDay]} {selectedTimeRange.startTime ? `${selectedTimeRange.startTime.slice(0, 5)} - ${selectedTimeRange.endTime.slice(0, 5)}` : null}
            </h1>
            <button onClick={handleClickReserve} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Reservar
            </button>
          </div>
        </Modal>
      </div>
  );
}