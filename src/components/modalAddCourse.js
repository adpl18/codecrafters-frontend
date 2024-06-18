import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../auth/authService';
import { get, post } from '../api/functions';
import API from '../api/endpoints';
import Dropdown from './dropdown';
import { categoryOptions } from '../config';

function ModalAddCourse({closeModal}) {
  const [isLoading, setIsLoading] = useState(true);
  const [backendUserInfo, setBackendUserInfo] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [priceCourse, setPriceCourse] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchUserInfo();

  }, [isLoading]);

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
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleClickFunction = () => {
    navigate("/login");
    closeModal();
  }

  const handleClickSaveCourse = async () => {
    console.log(selectedArea, courseName, courseDescription, priceCourse);
    const data = {
      name: courseName,
      price: priceCourse,
      description: courseDescription,
      category: selectedArea,
      userId: backendUserInfo.id
    }

    const response = await post(API.POST_COURSE(), data, "Curso creado exitosamente");
    if (response.ok) {
      closeModal();
    } else {
      console.error("Error al crear el curso");
    }
  }

  return (
    isLoading 
      ? <div className="flex items-center justify-center">Cargando...</div>
      : backendUserInfo 
        ? <div className="items-center justify-center">
            <h1 className="text-center 2xl:text-lg:text-4xl sm:text-3xl space-y-4 drop-shadow-2xl text-slate-900 shadow-black mb-4">
              Crear un curso
            </h1>
            <input 
              type="text" 
              id="courseName" 
              placeholder="Ingrese el nombre del curso"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              className="rounded-full shadow-md border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 w-full h-12"
              style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
            />
            <div className="flex mt-8 justify-between">
              <Dropdown 
                placeholder={"Elegir área"} 
                options={categoryOptions}
                onSelect={(selectedOption) => setSelectedArea(selectedOption)} 
              />
              <input 
                type="number"
                id="coursePrice"
                placeholder="Precio"
                value={priceCourse}
                onChange={(event) => setPriceCourse(event.target.value)}
                className="rounded-full shadow-md border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 w-1/2 h-12"
                style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
              /> 
            </div>
            <div className="mt-8">
              <textarea 
                type="textarea" 
                id="courseDescription" 
                placeholder="Agregar descripción del curso"
                value={courseDescription}
                onChange={(event) => setCourseDescription(event.target.value)}
                className="rounded-lg shadow-md border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 w-full h-64"
                style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
              />
            </div>
            <button onClick={handleClickSaveCourse} className="block mx-auto mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Crear curso
            </button>
          </div>
        : handleClickFunction()
  );
}

ModalAddCourse.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ModalAddCourse;