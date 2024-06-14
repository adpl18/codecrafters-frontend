// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import UserContext from "../auth/UserContext"
import React from 'react';
import Dropdown from '../components/dropdown';

export default function Busqueda() {
    // const { userInfo } = useContext(UserContext);
    // const [teachers, setTeachers] = useState([]);
    // const [error, setError] = useState("");
    // const navigate = useNavigate();

    return (
        <form className="w-full max-w-4xl mx-auto mt-11">
          <div className="flex relative">
            <div 
              className="flex relative w-full bg-white border-s-2 rounded-full focus:outline-none focus:bg-gray-700 shadow-md"
              style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
            >
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
              <input type="search" id="search-dropdown" style={{ zIndex: 1 }} className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-transparent rounded-e-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:border-blue-500" placeholder="    ingresar..." required />
              <button 
                type="submit"
                style={{ zIndex: 2 }}
                className="text-white absolute end-0 top-1/2 transform -translate-y-1/2 focus:ring-4 focus:outline-none font-medium bg-black hover:bg-gray-900 focus:ring-gray-300 rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Buscar</button>
            </div>
          </div>
        </form>
    );
}