import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/endpoints';
import { get } from '../api/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/fontawesome-free-solid';
import { formatPrice } from '../utils';

export default function TeacherProfile() {
  const { userId } = useParams();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const coursesWithRatings = await Promise.all(
        response.courses.map(async (course) => {
          const ratingData = await get(API.GET_COURSE_AVG_RATING(course.id));
          return { ...course, averageRating: ratingData.averageRating };
        })
      );
      setCourses(coursesWithRatings);
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
        <div className="flex flex-col items-center p-10">
          <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{teacherInfo.firstName} {teacherInfo.lastName}</h1>
            <p><span className="font-bold">Email:</span> {teacherInfo.email}</p>
            <p><span className="font-bold">Día de Nacimiento:</span> {new Date(teacherInfo.birthdate).toLocaleDateString()}</p>
          </div>
          <div className="w-full bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Cursos Impartidos</h1>
            <div className="flex flex-wrap justify-center text-center">
              {courses.length > 0 ? courses.map((course, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/4 mb-8 p-4">
                  <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl h-full cursor-pointer" onClick={() => navigate(`/course/${course.id}`)}>
                    <div className="space-y-4">
                      <p><span className="font-bold">Nombre:</span> {course.name}</p>
                      <p><span className="font-bold">Precio:</span> {formatPrice(course.price)}</p>
                      <p><span className="font-bold">Descripción:</span> {course.description}</p>
                      <p><span className="font-bold">Rating:</span> {course.averageRating !== null && course.averageRating !== undefined && course.averageRating !== -1 ? (
                        <>
                          {course.averageRating.toFixed(1)} <FontAwesomeIcon icon={faStar} />
                        </>
                      ) : (
                        "S/R"
                      )}
                      </p>
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