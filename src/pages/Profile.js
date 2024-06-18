import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../auth/authService';
import Dropdown from '../components/dropdown';
import Modal from 'react-modal';
import { deleteUser } from '../auth/authService';
import API from '../api/endpoints';
import { get, post, put, remove } from '../api/functions';
import plus from '../assets/images/plus.png';
import { optionsHours, daysOfWeekCompleteName, daysOfWeekNumber } from '../config';
import Login from './Login';
import { logout } from '../auth/authService';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendUserInfo, setBackendUserInfo] = useState(null);
  const [courses, setCourses] = useState([{}]);
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [availabilitiesTimes, setAvailabilitiesTimes] = useState([]);
  const navigate = useNavigate();
  const availabilitiesByDay = {'Lu': [], 'Ma': [], 'Mi': [], 'Ju': [], 'Vi': [], 'Sa': [], 'Do': []};

  useEffect(() => {
    fetchUserInfo();

    // Obtener fechas de la semana actual y disponibilidades
    getStartAndEndDateOfWeek();
    fetchAvailabilities();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchUserInfo = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userResponse = await getUserInfo(accessToken);
        get(API.GET_USER_EMAIL(userResponse.email))
        .then((response) => {
          setBackendUserInfo(response.user);
          setUserInfo(userResponse);
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

  // Filtro y orden de las horas por días de semana
  const filteredAvailabilities = availabilitiesTimes.filter(availability => {
    const availabilityDate = new Date(availability.date);
    return availabilityDate >= currentWeek.start && availabilityDate <= currentWeek.end;
  });

  filteredAvailabilities.forEach(availability => {
    const date = new Date(availability.date);
    const dayOfWeek = Object.keys(daysOfWeekNumber).find(day => daysOfWeekNumber[day] === date.getDay());
    availabilitiesByDay[dayOfWeek].push(availability);
  });

  Object.keys(availabilitiesByDay).forEach(day => {
    availabilitiesByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

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

  const handleClickOpenModal = (day) => {
    setSelectedDay(day);
    setSelectedTimeRange({});
    setIsModalOpen(true);
  };

  const handleClickOpenModalEdit = (time, day) => {
    setSelectedDay(day);
    setSelectedTimeRange(time);
    setIsModalEditOpen(true);
  };

  const handleClickSaveDate = async () => {
    if (selectedDay && selectedTimeRange) {
      //  Obtner el número que representa el día de la semana
      const numberDay = daysOfWeekNumber[selectedDay];
      const selectedDate = new Date(currentWeek.start);
      selectedDate.setDate(selectedDate.getDate() + numberDay);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const newTime = { date: formattedDate, startTime: selectedTimeRange.startTime, endTime: selectedTimeRange.endTime, isAvailable: true, userId: backendUserInfo.id };
      await post(API.POST_AVAILABILITIES(), newTime, "Horario agregado correctamente");
      fetchAvailabilities();
      setIsModalOpen(false);
    }
  };

  const handleClickBlock = async () => {
    const newTime = { ...selectedTimeRange };
    newTime.isAvailable = !selectedTimeRange.isAvailable;
    await put(API.PUT_CANCEL_AVAILABILITIES(selectedTimeRange.id), {}, `Horario ${selectedTimeRange.isAvailable ? "bloqueado" : "desbloqueado"} correctamente`);
    // await put(API.PUT_AVAILABILITIES(newTime.id), newTime, `Horario ${selectedTimeRange.isAvailable ? "bloqueado" : "desbloqueado"} correctamente`);
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
        
        // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${backendUserInfo?.id}`, {
        //   method: 'DELETE',
        // });
  
        if (response.ok) {
          logout();
          setUserInfo(null);
          navigate("/");
          console.log("USUARIO ELIMINADO CORRECTAMENTE EN EL BACKEND")
        } else {
          throw new Error('Failed to delete user on backend');
        }
      } catch (error) {
        alert(`Error al eliminar la cuenta: ${error.message}`);
      }
    }
  };

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
          <div className="w-2/3 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl">
            <div>Semana del {currentWeek ? `${formatDate(currentWeek.start)} - ${formatDate(currentWeek.end)}` : "Cargando..."}</div>
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
            </div>
          </div>
        </div>
      </div>
      <div>
        {courses.length > 0 ? (
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Mis Cursos</h1>
            <div className="flex justify-center text-center space-x-4 w-full p-10">
              {courses.map((course, index) => (
              <div key={index} className="w-1/3 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl" onClick={() => navigate(`/course/${course.id}`)}>
                <div className="text-center">
                    <div className="space-y-4">
                      <p><span className="font-bold">Nombre:</span> {course.name}</p>
                      <p><span className="font-bold">Precio:</span> {course.price}</p>
                      <p><span className="font-bold">Descripción:</span> {course.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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
            height: '55%',
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
              optionsSelected={availabilitiesByDay[selectedDay]}
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
            width: '40%',
            height: '30%',
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
    </div>
    : <Login />
  );
}
