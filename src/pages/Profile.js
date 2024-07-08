import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../auth/authService';
import Dropdown from '../components/dropdown';
import Modal from 'react-modal';
import { deleteUser } from '../auth/authService';
import API from '../api/endpoints';
import { get, post, put, remove } from '../api/functions';
import { optionsHours, daysOfWeekCompleteName } from '../config';
import Login from './Login';
import { logout } from '../auth/authService';
import Calendar from '../components/calendar';
import ToggleButton from '../components/toggleButton';
import StarRating from '../components/starRating';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendUserInfo, setBackendUserInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedFormattedDate, setSelectedFormattedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [availabilitiesTimes, setAvailabilitiesTimes] = useState([]);
  const navigate = useNavigate();
  const [availabilitiesByDay, setAvailabilitiesByDay] = useState({'Lu': [], 'Ma': [], 'Mi': [], 'Ju': [], 'Vi': [], 'Sa': [], 'Do': []});
  const [reservations, setReservations] = useState([])
  const [myReservations, setMyReservations] = useState([])
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchUserInfo();

    // Obtener fechas de la semana actual y disponibilidades
    getStartAndEndDateOfWeek();
    fetchAvailabilities();
    fetchCourses();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchMyReservations = async (userId) => {
    get(API.GET_RESERVATION_USER(userId))
      .then((response) => {
        setMyReservations(response.reservations);
      })
      .catch((error) => {
        console.error(error);
      }
    );
  }

  const fetchReservations = async (availabilities) => {
    get(API.GET_RESERVATIONS())
      .then((response) => {
        const reservationsFilters = response.reservations.filter(reservation => {
          return availabilities.some(avail => avail.id === reservation.availabilityId);
        });     
        setReservations(reservationsFilters);
      })
      .catch((error) => {
        console.error(error);
      }
    );
  }

  const fetchUserInfo = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userResponse = await getUserInfo(accessToken);
        get(API.GET_USER_EMAIL(userResponse.email))
        .then((response) => {
          setBackendUserInfo(response.user);
          setUserInfo(userResponse);
          fetchMyReservations(response.user.id);
          setIsLoading(false);
        })
        .catch((error) => {
          navigate("/login");
        });
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }

  const fetchAvailabilities = async () => {
    if (backendUserInfo) {
      get(API.GET_AVAILABILITIES_USER(backendUserInfo.id))
        .then((response) => {
          setAvailabilitiesTimes(response.availabilities);
          fetchReservations(response.availabilities);
        })
        .catch((error) => {
          console.error(error);
        }
      );
    }
  }
  
  const fetchCourses = async () => {
    if (backendUserInfo) {
      get(API.GET_COURSES_USER(backendUserInfo.id))
        .then((response) => {
          setCourses(response.courses);
        })
        .catch((error) => {
          console.error(error);
        }
      );
    }
  }

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function getStartAndEndDateOfWeek() {
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek + 7);

    setCurrentWeek({ start: monday, end: sunday });
  }

  const handleLogout = () => {
    logout();
    setUserInfo(null);
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile", { state: { userId: backendUserInfo?.id } });
  };

  const handleClickAddTime = (day, formattedDate, availabilitiesByDay) => {
    setAvailabilitiesByDay(availabilitiesByDay);
    setSelectedFormattedDate(formattedDate);
    setSelectedDay(day);
    setSelectedTimeRange({});
    setIsModalOpen(true);
  };

  const handleClickOnTime = (time, day, formattedDate) => {
    setSelectedFormattedDate(formattedDate);
    setSelectedDay(day);
    setSelectedTimeRange(time);
    setIsModalEditOpen(true);
  };

  const handleClickSaveDate = async () => {
    const newTime = { date: selectedFormattedDate, startTime: selectedTimeRange.startTime, endTime: selectedTimeRange.endTime, isAvailable: true, userId: backendUserInfo.id };
    await post(API.POST_AVAILABILITIES(), newTime, "Horario agregado correctamente");
    fetchAvailabilities();
    setIsModalOpen(false);
  };

  const handleClickBlock = async () => {
    const newTime = { ...selectedTimeRange };
    newTime.isAvailable = !selectedTimeRange.isAvailable;
    await put(API.PUT_UPDATE_AVAILABILITIES(selectedTimeRange.id), {isAvailable: !selectedTimeRange.isAvailable}, `Horario ${selectedTimeRange.isAvailable ? "bloqueado" : "desbloqueado"} correctamente`);
    setIsModalEditOpen(false);
    fetchAvailabilities();
  };

  const handleClickDelete = async () => {
    await remove(API.DELETE_AVAILABILITIES(selectedTimeRange.id), `Horario eliminado correctamente`);
    setIsModalEditOpen(false);
    fetchAvailabilities();
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (confirmation) {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        
        await deleteUser(accessToken);

        const response = await remove(API.DELETE_USER(backendUserInfo?.id));
        
        if (response.ok) {
          logout();
          setUserInfo(null);
          navigate("/");
        } else {
          throw new Error('Failed to delete user on backend');
        }
      } catch (error) {
        alert(`Error al eliminar la cuenta: ${error.message}`);
      }
    }
  };

  const handleClickCancelReservation = async (reservation) => {
    await put(API.PUT_RESERVATION_CANCEL(reservation.id), {}, "Reserva cancelada correctamente");
    fetchReservations(availabilitiesTimes);
  };

  const handleReviewSubmit = async () => {
    const review = {
      reservationId: selectedReservation.id,
      rating: reviewRating,
      comment: reviewComment,
    };

    await put(API.PUT_RESERVATION_REVIEWED(selectedReservation.id), {}, "Reserva marcada como revisada");
    await post(API.POST_REVIEW(), review, "Reseña guardada correctamente");
    setIsReviewModalOpen(false);
    fetchMyReservations(backendUserInfo.id);
  };

  const toggleView = () => {
    setIsTeacherView(!isTeacherView);
  };

  const handleOpenReviewModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsReviewModalOpen(true);
  };

  const now = new Date();
  const canceledReservations = myReservations.filter(reservation => reservation.isCancelled);
  const upcomingReservations = myReservations.filter(reservation => !reservation.isCancelled
     && new Date(`${reservation.Availability?.date}T${reservation.Availability?.startTime}`) > now);
  const pastReservations = myReservations.filter(reservation => !reservation.isCancelled
     && new Date(`${reservation.Availability?.date}T${reservation.Availability?.startTime}`) <= now);

  return (
    isLoading ?
      <div className="flex items-center justify-center min-h-screen bg-cover">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
     : userInfo ?
     <div>
      <div>
        <div className="flex  text-center space-x-4 w-full p-10">
          <div className="w-1/3 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">{userInfo.name} {userInfo.family_name}</h1>
            <div className="text-center">
              {userInfo ? (
                <div className="space-y-4">
                  <p><span className="font-bold">Email:</span> {userInfo.email}</p>
                  <p><span className="font-bold">Día de Nacimiento:</span> {new Date(userInfo.birthdate).toLocaleDateString()}</p>
                  <button
                    onClick={handleEditProfile}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mb-4"
                  >
                    Editar Usuario
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline"
                  >
                    Cerrar Sesión
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mt-4"
                  >
                    Eliminar Cuenta
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-3/4 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl">
            <Calendar availabilities={availabilitiesTimes} canEdit={true} functionClickOnTime={handleClickOnTime} functionClickAdd={handleClickAddTime}/>
          </div>
        </div>
      </div>

      <div>
      <ToggleButton isTeacherView={isTeacherView} toggleView={toggleView} /> 

      {/* Teacher View */}
      {isTeacherView ? (
        <div>
          {/* Mis cursos */}
          <div>
            {courses.length > 0 ? (
              <div>
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Mis Cursos</h1>
                <div className="flex flex-wrap justify-center text-center space-x-4 p-10">
                  {courses.map((course, index) => (
                    <div key={index} className="w-1/5 mb-8">
                      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl h-full" onClick={() => navigate(`/course/${course.id}`)}>
                        <div className="text-center">
                          <div className="space-y-4">
                            <p><span className="font-bold">Nombre:</span> {course.name}</p>
                            <p><span className="font-bold">Precio:</span> ${course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP</p>
                            <p><span className="font-bold">Descripción:</span> {course.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Mis reservas */}
          <div>
            {reservations.length > 0 ? (
              <div>
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Mis próximas clases</h1>
                <div className="flex flex-wrap justify-center text-center space-x-4 p-10">
                  {reservations.map((reservation, index) => (
                    <div key={index} className="w-1/3 mb-8">
                      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl h-full">
                        <div className="text-center">
                          <div className="space-y-4">
                            <p><span className="font-bold">Número de reserva: </span>{reservation.id}</p>
                            <p><span className="font-bold">Nombre alumno: </span>{reservation.User?.firstName} {reservation.User?.lastName}</p>
                            <p><span className="font-bold">Fecha reserva: </span>{reservation.Availability?.date}</p>
                            <p><span className="font-bold">Horario reserva: </span>{reservation.Availability?.startTime.split(':').slice(0, 2).join(':')} - {reservation.Availability?.endTime.split(':').slice(0, 2).join(':')}</p>
                            <p><span className="font-bold">Curso: </span>{reservation.Course?.name}</p>
                            <p><span className="font-bold">Precio: </span>${reservation.Course?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP</p>
                          </div>
                        </div>
                        {!reservation.isCancelled 
                          ? <button onClick={() => handleClickCancelReservation(reservation)} className="w-full py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">
                              Cancelar
                            </button>
                          : <div className="w-full py-2 font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">Reserva cancelada</div> 
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          {/* Mis solicitudes */}
          <div>
            {myReservations.length > 0 ? (
              <div>
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Mis solicitudes</h1>
                {/* Cancelled Reservations */}
                <div>
                  <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Canceladas</h2>
                  <div className="flex flex-wrap justify-center text-center space-x-4 p-10">
                    {canceledReservations.map((reservation, index) => (
                      <div key={index} className="w-1/3 mb-8">
                        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl h-full">
                          <div className="text-center">
                            <div className="space-y-4">
                              <p><span className="font-bold">Número de reserva: </span>{reservation.id}</p>
                              <p><span className="font-bold">Fecha reserva: </span>{reservation.Availability?.date}</p>
                              <p><span className="font-bold">Horario reserva: </span>{reservation.Availability?.startTime.split(':').slice(0, 2).join(':')} - {reservation.Availability?.endTime.split(':').slice(0, 2).join(':')}</p>
                              <p><span className="font-bold">Curso: </span>{reservation.Course?.name}</p>
                              <p><span className="font-bold">Precio: </span>${reservation.Course?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP</p>
                            </div>
                          </div>
                          <div className="w-full py-2 font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">Reserva cancelada</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Reservations */}
                <div>
                  <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Próximas clases</h2>
                  <div className="flex flex-wrap justify-center text-center space-x-4 p-10">
                    {upcomingReservations.map((reservation, index) => (
                      <div key={index} className="w-1/3 mb-8">
                        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl h-full">
                          <div className="text-center">
                            <div className="space-y-4">
                              <p><span className="font-bold">Número de reserva: </span>{reservation.id}</p>
                              <p><span className="font-bold">Fecha reserva: </span>{reservation.Availability?.date}</p>
                              <p><span className="font-bold">Horario reserva: </span>{reservation.Availability?.startTime.split(':').slice(0, 2).join(':')} - {reservation.Availability?.endTime.split(':').slice(0, 2).join(':')}</p>
                              <p><span className="font-bold">Curso: </span>{reservation.Course?.name}</p>
                              <p><span className="font-bold">Precio: </span>${reservation.Course?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP</p>
                            </div>
                          </div>
                          {!reservation.isCancelled 
                            ? <button onClick={() => handleClickCancelReservation(reservation)} className="w-full py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">
                                Cancelar
                              </button>
                            : <div className="w-full py-2 font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">Reserva cancelada</div> 
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Reservations */}
                <div>
                  <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Clases que asististe</h2>
                  <div className="flex flex-wrap justify-center text-center space-x-4 p-10">
                    {pastReservations.map((reservation, index) => (
                      <div key={index} className="w-1/3 mb-8">
                        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl h-full">
                          <div className="text-center">
                            <div className="space-y-4">
                              <p><span className="font-bold">Número de reserva: </span>{reservation.id}</p>
                              <p><span className="font-bold">Fecha reserva: </span>{reservation.Availability?.date}</p>
                              <p><span className="font-bold">Horario reserva: </span>{reservation.Availability?.startTime.split(':').slice(0, 2).join(':')} - {reservation.Availability?.endTime.split(':').slice(0, 2).join(':')}</p>
                              <p><span className="font-bold">Curso: </span>{reservation.Course?.name}</p>
                              <p><span className="font-bold">Precio: </span>${reservation.Course?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP</p>
                            </div>
                          </div>
                          {!reservation.isReviewed 
                            ? <button onClick={() => handleOpenReviewModal(reservation)} className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mb-4">
                                Dejar reseña
                              </button>
                            : <div className="w-full py-2 font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">Ya dejaste reseña</div> 
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Agregar Horario"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: '50%',
            height: '70%',
            margin: 'auto',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
          }
        }}
      >
        <div className="p-4">
          <h1 className="text-center 2xl:text-lg:text-4xl sm:text-3xl space-y-4 font-bold drop-shadow-2xl text-slate-900 shadow-black">
            Agregar horario para {daysOfWeekCompleteName[selectedDay]} {currentWeek ? formatDate(currentWeek.start) : null}
          </h1>
          <div className="flex justify-center mt-8">
            <Dropdown 
              placeholder={"Elegir horario"}
              options={optionsHours} 
              optionsSelected={availabilitiesByDay[selectedDay] ? availabilitiesByDay[selectedDay] : []}
              onSelect={(selectedOption) => setSelectedTimeRange(selectedOption)}
            />
          </div>
          <p className="mt-20 text-center text-xl text-gray-600">Horario seleccionado: {selectedTimeRange.startTime ? `${selectedTimeRange.startTime.slice(0, 5)} - ${selectedTimeRange.endTime.slice(0, 5)}` : '...'}</p>
          <button onClick={handleClickSaveDate} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Aceptar
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isModalEditOpen}
        onRequestClose={() => setIsModalEditOpen(false)}
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
            Editar horario {daysOfWeekCompleteName[selectedDay]} {selectedTimeRange.length > 0 ? `${selectedTimeRange.startTime.slice(0, 5)} - ${selectedTimeRange.endTime.slice(0, 5)}` : null}
          </h1>
          {/* <button onClick={handleClickSaveDate} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> */}
          <button onClick={handleClickBlock} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {selectedTimeRange.isAvailable ? "Bloquear" : "Desbloquear"}
          </button>
          <button onClick={handleClickDelete} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Eliminar
          </button>
        </div>
      </Modal>
      <Modal isOpen={isReviewModalOpen} onRequestClose={() => setIsReviewModalOpen(false)}>
      <h2>Dejar Reseña</h2>
      <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
      <textarea
        value={reviewComment}
        onChange={(e) => setReviewComment(e.target.value)}
        placeholder="Escribe tu comentario aquí"
        className="w-full p-2 border rounded mb-4"
      />
      <button onClick={handleReviewSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Enviar Reseña</button>
      <button onClick={() => setIsReviewModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-4">Cancelar</button>
    </Modal>
    </div>
    : <Login />
  );
}
