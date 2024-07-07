import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import { get } from '../api/functions';
import API from '../api/endpoints';
import profileIcon from "../assets/images/user.png";
import { categoryOptions } from '../config';
import { useNavigate } from 'react-router-dom';

export default function Busqueda() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTermParam = params.get('searchTerm') || "";
    const categoryParam = params.get('category') || "";
    const priceRangeParam = params.get('priceRange') || "";

    setSearchTerm(searchTermParam);
    setSelectedCategory(categoryParam);
    setSelectedPriceRange(priceRangeParam);

    const fetchCourses = async () => {
      try {
        const data = await get(API.GET_COURSES());
        let filteredCourses = data.courses;

        if (searchTermParam.trim() !== "") {
          filteredCourses = filteredCourses.filter(course =>
            course.name.toLowerCase().includes(searchTermParam.toLowerCase())
          );
        }

        if (categoryParam) {
          filteredCourses = filteredCourses.filter(course =>
            course.category === categoryParam
          );
        }

        if (priceRangeParam) {
          filteredCourses = filteredCourses.filter(course => {
            if (priceRangeParam === "Menor a 5000") {
              return course.price < 5000;
            } else if (priceRangeParam === "Entre 5000 y 10000") {
              return course.price >= 5000 && course.price <= 10000;
            } else if (priceRangeParam === "Sobre 10000") {
              return course.price > 10000;
            }
            return true;
          });
        }

        setCourses(filteredCourses);
      } catch (err) {
        setError("Error fetching courses");
      }
    };

    fetchCourses();
  }, [location.search]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const data = await get(API.GET_COURSES());
      let filteredCourses = data.courses;

      if (searchTerm.trim() !== "") {
        filteredCourses = filteredCourses.filter(course =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory && selectedCategory !== "Elegir categoria") {
        filteredCourses = filteredCourses.filter(course =>
          course.category === selectedCategory
        );
      }

      if (selectedPriceRange && selectedPriceRange !== "Elegir rango de precios") {
        filteredCourses = filteredCourses.filter(course => {
          if (selectedPriceRange === "Menor a 5000") {
            return course.price < 5000;
          } else if (selectedPriceRange === "Entre 5000 y 10000") {
            return course.price >= 5000 && course.price <= 10000;
          } else if (selectedPriceRange === "Sobre 10000") {
            return course.price > 10000;
          }
          return true;
        });
      }

      setCourses(filteredCourses);
    } catch (err) {
      setError("Error fetching courses");
    }
  };

  return (
    <div className="min-h-screen flex ">
      <div className="w-1/7 flex flex-col justify-center items-start p-8 left-0 h-screen">
        <form className="w-full max-w-md h-[70%]" onSubmit={handleSearch}>
          <div className="space-y-4">
            <button
              type="submit"
              className="text-white bg-black hover:bg-gray-900 focus:ring-gray-300 rounded-full text-lg px-8 py-4 mt-6 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              Buscar
            </button>
            <div 
              className="w-full bg-white border-s-2 rounded-full focus:outline-none focus:bg-gray-700 shadow-md"
              style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
            >
              <input
                type="search"
                id="search-dropdown"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="block p-4 w-full text-lg text-black bg-transparent border rounded-full focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500"
                placeholder="Ingresar..."
              />
            </div>
            <div className="mt-6">
              <Dropdown
                placeholder="Elegir categoria"
                options={['Elegir categoria'].concat(categoryOptions)}
                onSelect={(option) => setSelectedCategory(option)}
                className="z-10"
              />
            </div>
            <div className="mt-6">
              <Dropdown
                placeholder="Elegir rango de precios"
                options={['Elegir rango de precios','Menor a 5000', 'Entre 5000 y 10000', 'Sobre 10000']}
                onSelect={(option) => setSelectedPriceRange(option)}
                className="z-10"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-8 ml-9">
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="mt-10">
          {courses.length === 0 ? (
            <p className="text-center">No courses found</p>
          ) : (
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="p-8 bg-white rounded-lg shadow-md flex items-stretch" style={{width: '50vw'}} onClick={() => navigate(`/course/${course.id}`)}>
                  <div className="mr-4 bg-pink-500 rounded-full flex items-center justify-center" style={{flex: '0 0 auto', width: 'calc(100% * 1/3)', maxWidth: '200px', height: '200px'}}>
                    <img src={profileIcon} alt="Profile" className="rounded-full border-2 border-pink-500 object-cover" style={{maxWidth: '100%', maxHeight: '100%'}}/>
                  </div>
                  <div className='text-left'>
                    <p className="mt-2 font-semibold text-3xl">{course.User ? `${course.User.firstName} ${course.User.lastName}` : 'Unknown'}</p>
                    <h3 className="text-gray-600 text-3xl">{course.name}</h3>
                    <p className="mt-2 text-gray-600 text-3xl">{course.category}</p>
                    <p className="mt-2 text-gray-600 text-3xl">{course.description}</p>
                    <p className="mt-2 text-gray-600 text-3xl">${course.price.toLocaleString()}</p>
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
