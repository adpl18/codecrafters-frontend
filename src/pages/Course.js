import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../auth/authService';
import { useParams } from 'react-router';
import { get, post, put } from '../api/functions';
import API from '../api/endpoints';
import Calendar from '../components/calendar';
import Modal from 'react-modal';
import { daysOfWeekCompleteName } from '../config';

export default function Course() {
  const { id } = useParams();
  const [backendUserInfo, setBackendUserInfo] = useState(null);
  const [courseInfo, setCourseInfo] = useState({});
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFormattedDate, setSelectedFormattedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({});

  useEffect(() => {
    fecthCourseInfo();
    fetchUserInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserInfo = async () => {
    console.log("aca andamos")
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userResponse = await getUserInfo(accessToken);
        get(API.GET_USER_EMAIL(userResponse.email))
        .then((response) => {
          setBackendUserInfo(response.user);
          setIsLoading(false);
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fecthCourseInfo = async () => {
    get(API.GET_COURSE(id))
      .then(data => {
        setCourseInfo(data.course);
        fetchAvailabilities(data.course.userId);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }
  
  // const fetchReservations = async (availabilities) => {
  //   get(API.GET_RESERVATIONS())
  //     .then((response) => {             
  //       const reservationsFilters = response.reservations
  //         .filter(reservation => availabilities.some(avail => avail.id === reservation.availabilityId));

  //       const reservationsDictionary = reservationsFilters.reduce((dict, reservation) => {
  //           dict[reservation.availabilityId] = reservation;
  //           return dict;
  //       }, {});

  //       serReservations(reservationsDictionary);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  const fetchAvailabilities = async (userId) => {
    get(API.GET_AVAILABILITIES_USER(userId))
      .then(data => {
        console.log("avaiiii", data.availabilities)
        // fetchReservations(data.availabilities);
        setAvailabilities(data.availabilities);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  const handleClickOnTime = (time, day, formattedDate) => {
    console.log("ACAAAA", time)
    setSelectedFormattedDate(formattedDate);
    setSelectedDay(day);
    setSelectedTimeRange(time);
    setIsModalOpen(true);
  };
    
  const handleClickReserve = async () => {
    setIsModalOpen(false);
    console.log(selectedFormattedDate)
    console.log(backendUserInfo.id, selectedTimeRange.id)
    // Reservar horario
    const response = await post(API.POST_RESERVATION(), {courseId: id, userId: backendUserInfo.id, availabilityId: selectedTimeRange.id}, "Se ha reservado el horario correctamente")
    if (response.ok) {
      await put(API.PUT_UPDATE_AVAILABILITIES(selectedTimeRange.id), {isAvailable: false});
      fetchAvailabilities(courseInfo.userId);
    }
  }
  console.log(courseInfo)
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
        {courseInfo && backendUserInfo
        ?
          <div className="flex justify-center m-10">
            <div className="bg-white p-10 rounded-lg shadow-xl w-full">
              <h1 className="text-2xl font-bold text-center">{courseInfo.name}</h1>
              <p className="text-center text-gray-500">Profesor: {courseInfo.User.firstName} {courseInfo.User.lastName}</p>
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