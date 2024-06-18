import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import UserContext from "../auth/UserContext"
import LandingPageCard from '../components/landingPageCard';
import Dropdown from '../components/dropdown';
import inputIcon from "../assets/images/input.png";
import mailIcon from "../assets/images/mail.png";
import estudiarIcon from "../assets/images/estudiar.png";

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  const handleClickSearch = (event) => {
    event.preventDefault();
    navigate(`/busqueda?searchTerm=${searchTerm}&category=${selectedCategory}&priceRange=${selectedPriceRange}`);
  };

  return (
    <div className="flex-1 mt-24 mb-32 2xl:mx-44 xl:mx-40 lg:mx-32 sm:mx-4 text-center relative font-lexend">
      <div className="2xl:mx-56 lg:mx-28 sm:mx-12 space-y-5">
        <h1 className="2xl:text-7xl lg:text-6xl sm:text-5xl space-y-5 font-bold drop-shadow-2xl text-slate-900 shadow-black">
          Busca profesores de los temas que tu quieras
        </h1>
      </div>
      
      <form className="w-full max-w-4xl mx-auto mt-11" onSubmit={handleClickSearch}>
        <div className="flex relative">
          <div 
            className="flex relative w-full bg-white border-s-2 rounded-full focus:outline-none focus:bg-gray-700 shadow-md"
            style={{ backgroundColor: '#f6f6f6', color: '#4D4D4D' }}
          >
            <Dropdown
              placeholder="Elegir categoria"
              options={['Elegir categoria','Matematica', 'Quimica', 'Fisica']}
              onSelect={(option) => setSelectedCategory(option)}
              className="z-10"
            />
            <Dropdown
              placeholder="Elegir rango de precios"
              options={['Elegir rango de precios','Menor a 5000', 'Entre 5000 y 10000', 'Sobre 10000']}
              onSelect={(option) => setSelectedPriceRange(option)}
              className="z-10"
            />
            <input 
              type="search" 
              id="search-dropdown" 
              style={{ zIndex: 1 }} 
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-transparent rounded-e-lg focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500" 
              placeholder="    ingresar..." 
              // required 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              style={{ zIndex: 2 }}
              className="text-white absolute end-0 top-1/2 transform -translate-y-1/2 focus:ring-4 focus:outline-none font-medium bg-black hover:bg-gray-900 focus:ring-gray-300 rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Buscar</button>
          </div>
        </div>
      </form>


      <div className="flex 2xl:space-x-16 lg:space-x-8 sm:space-x-2 justify-center text-center mt-20 mb-32">
          <LandingPageCard
              principalText="Ingreso simple"
              secondaryText="Ingresa con tus datos y comienza la busqueda de profesores"
              icon={inputIcon}
          />
          <LandingPageCard
              principalText="Anuncia tu clase"
              secondaryText="Publica una clase para que las demas personas la vean"
              icon={estudiarIcon}
          />
          <LandingPageCard
              principalText="Inscribete a una clase"
              secondaryText="Inscribete a una clase en el horario que ofrezca el profesor"
              icon={mailIcon}
          />
      </div>
    </div>
  );
}