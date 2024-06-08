import { React } from 'react';
import { Link } from 'react-router-dom';
import LandingPageCard from '../components/landingPageCard';
import inputIcon from "../assets/images/input.png";
import mailIcon from "../assets/images/mail.png";
import estudiarIcon from "../assets/images/estudiar.png";

export default function Home() {
    return (
      <div className="flex-1 mt-24 mb-32 2xl:mx-44 xl:mx-40 lg:mx-32 sm:mx-4 text-center relative font-lexend">
        <div className="2xl:mx-56 lg:mx-28 sm:mx-12 space-y-5">
          <Link to="/profile">Perfil</Link>
          {console.log(process.env)}
          <h1 className="2xl:text-7xl lg:text-6xl sm:text-5xl space-y-5 font-bold drop-shadow-2xl text-slate-900 shadow-black">
            Busca profesores de los temas que tu quieras
          </h1>
        </div>
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