import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/endpoints';
import { get } from '../api/functions';

export default function TeacherProfile() {
  const { userId } = useParams();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  const fetchTeacherInfo = async () => {
    try {
      const response = await get(API.GET_USER(userId));
      setTeacherInfo(response.user);
      fetchCourses(response.user.id);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchCourses = async (userId) => {
    try {
      const response = await get(API.GET_COURSES_USER(userId));
      setCourses(response.courses);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    isLoading ?
      <div className="flex items-center justify-center min-h-screen bg-cover">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
      : teacherInfo ?
        <div className="flex justify-center m-10">
          <div className="bg-white p-10 rounded-lg shadow-xl w-full">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">{teacherInfo.name} {teacherInfo.family_name}</h1>
            <div className="text-center">
              <p><span className="font-bold">Email:</span> {teacherInfo.email}</p>
              <p><span className="font-bold">Día de Nacimiento:</span> {new Date(teacherInfo.birthdate).toLocaleDateString()}</p>
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4 mt-8">Cursos Impartidos</h1>
            <div className="flex flex-wrap justify-center text-center space-x-4 p-10">
              {courses.length > 0 ? courses.map((course, index) => (
                <div key={index} className="w-1/5 mb-8">
                  <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl h-full" onClick={() => navigate(`/course/${course.id}`)}>
                    <div className="text-center">
                      <div className="space-y-4">
                        <p><span className="font-bold">Nombre:</span> {course.name}</p>
                        <p><span className="font-bold">Precio:</span> {course.price}</p>
                        <p><span className="font-bold">Descripción:</span> {course.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )) : <p>No hay cursos disponibles.</p>}
            </div>
          </div>
        </div>
        : <p>Profesor no encontrado</p>
  );
}