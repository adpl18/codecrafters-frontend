import React, { useState, useEffect } from 'react';
import Dropdown from '../components/dropdown';
import { get } from '../api/functions';
import API from '../api/endpoints';
import profileIcon from "../assets/images/user.png";

export default function Busqueda() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await get(API.GET_COURSES());
        setCourses(data.courses);
      } catch (err) {
        setError("Error fetching courses");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-8xl mt-11 flex flex-col lg:flex-row gap-1 justify-between">
      <div className="flex flex-col">
        <form className="w-full">
          <button
            type="submit"
            className="text-white bg-black hover:bg-gray-900 focus:ring-gray-300 rounded-full text-sm px-5 py-2.5 mt-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            Buscar
          </button>
          <div 
            className="w-full bg-white border-s-2 rounded-full focus:outline-none focus:bg-gray-700 shadow-md"
            style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
          >
            <input
              type="search"
              id="search-dropdown"
              className="block p-2.5 w-full text-sm text-gray-900 bg-transparent border rounded-full focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:border-blue-500"
              placeholder="Ingresar..."
              required
            />
          </div>
          <Dropdown
            placeholder="Elegir area"
            options={['Matematica', 'Quimica', 'Fisica']}
            onSelect={(option) => console.log(option)}
            className="z-10"
          />
          <Dropdown
            placeholder="Categoría"
            options={['Matematica', 'Quimica', 'Fisica']}
            onSelect={(option) => console.log(option)}
            className="z-10"
          />
        </form>
      </div>

      <div className="flex-grow flex flex-col items-center">
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="mt-10">
          {courses.length === 0 ? (
            <p className="text-center">No courses found</p>
          ) : (
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="p-8 bg-white rounded-lg shadow-md flex items-stretch" style={{width: '50vw'}}>
                  <div className="mr-4 bg-pink-500 rounded-full flex items-center justify-center" style={{flex: '0 0 auto', width: 'calc(100% * 1/3)', maxWidth: '200px', height: '200px'}}>
                    <img src={profileIcon} alt="Profile" className="rounded-full border-2 border-pink-500 object-cover" style={{maxWidth: '100%', maxHeight: '100%'}}/>
                  </div>
                  <div className='text-left'>
                    <p className="mt-2 font-semibold text-3xl">{course.User ? `${course.User.firstName} ${course.User.lastName}` : 'Unknown'}</p>
                    <h3 className="text-gray-600 text-3xl">{course.name}</h3>
                    <p className="mt-2 text-gray-600 text-3xl">{course.category}</p>
                    <p className="mt-2 text-3xl">{course.description}</p>
                    {/* <p className="mt-2 font-bold">{course.price} USD</p> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}