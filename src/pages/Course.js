import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../auth/authService';
import { useParams } from 'react-router';
import { get, post, put, remove } from '../api/functions'; // Import del function
import API from '../api/endpoints';
import Calendar from '../components/calendar';
import Modal from 'react-modal';
import { daysOfWeekCompleteName } from '../config';
import { useNavigate } from 'react-router-dom';
import ModalAddCourse from '../components/modalAddCourse';
import { formatPrice } from '../utils';

export default function Course() {
  const { id } = useParams();
  const [backendUserInfo, setBackendUserInfo] = useState(null);
  const [courseInfo, setCourseInfo] = useState({});
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCourseOpen, setIsModalCourseOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fecthCourseInfo();
    fetchUserInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserInfo = async () => {
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
    if (backendUserInfo?.id === courseInfo?.userId) {
      alert("No puedes reservar un horario de tu propio curso");
      return
    }
    setSelectedDay(day);
    setSelectedTimeRange(time);
    setIsModalOpen(true);
  };
    
  const handleClickReserve = async () => {
    if (!isLoading && backendUserInfo === null) {
      navigate("/login")
      return
    }
    setIsModalOpen(false);
    const response = await post(API.POST_RESERVATION(), {courseId: id, userId: backendUserInfo.id, availabilityId: selectedTimeRange.id}, "Se ha reservado el horario correctamente")
    if (response.ok) {
      await put(API.PUT_UPDATE_AVAILABILITIES(selectedTimeRange.id), {isAvailable: false});
      fetchAvailabilities(courseInfo.userId);
    }
  }

  const handleClickEdit = () => {
    setIsModalCourseOpen(true);
    // navigate(`/edit-course/${id}`); 
  }

  const handleClickEditCourse = () => {
    setIsModalCourseOpen(false);
    fecthCourseInfo();
  }

  const handleDeleteCourse = async () => {
    try {
      await remove(API.DELETE_COURSE(id)); // Assuming you have an endpoint for deleting the course
      alert('Curso eliminado correctamente');
      navigate('/'); // Redirect to home or another appropriate page
    } catch (error) {
      console.error('Error eliminando el curso', error);
    }
  };

  const handleProfessorClick = () => {
    if (backendUserInfo?.id === courseInfo.userId) {
      navigate("/profile");
    } else {
      navigate(`/profile/${courseInfo.userId}`);
    }
  };

  return (
    isLoading 
      ? <div className="flex items-center justify-center min-h-screen bg-cover">
          <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <p>Loading...</p>
          </div>
        </div>
      : <div>
          {courseInfo && 
          <div className="flex justify-center m-10">
            <div className="bg-white p-10 rounded-lg shadow-xl w-full">
              {backendUserInfo?.id === courseInfo.userId 
                ? <div style={{ textAlign: 'right' }}>
                    <button onClick={handleClickEdit} className="p-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mt-4">
                      Editar
                    </button>
                    <button onClick={handleDeleteCourse} className="p-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-full focus:outline-none focus:shadow-outline mt-4 ml-4">
                      Eliminar
                    </button>
                  </div>
                : null}
                <h1 className="text-2xl font-bold text-center">{courseInfo.name}</h1>
                <p className="text-center text-gray-500">
                  Profesor: <span className=" hover:underline cursor-pointer" onClick={handleProfessorClick}>
                    {courseInfo.User.firstName} {courseInfo.User.lastName}
                  </span>
                </p>
                <p className="text-center text-gray-500">Precio: {formatPrice(courseInfo.price)}</p>
                <p className="text-center text-gray-500">Categoría: {courseInfo.category}</p>
                <p className="text-center text-gray-500">{courseInfo.description}</p>
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
          }
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
            
        <Modal
          isOpen={isModalCourseOpen}
          onRequestClose={() => setIsModalCourseOpen(false)}
          contentLabel="Editar curso"
          ariaHideApp={false}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              width: '50%',
              height: 'auto',
              maxWidth: '80%',
              maxHeight: '80%',
              margin: 'auto',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
            }
          }}
        >
          <ModalAddCourse closeModal={() => handleClickEditCourse()} reload={false} courseInfo={courseInfo}/>
        </Modal>
      </div>
  );
}