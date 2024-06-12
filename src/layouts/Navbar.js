import React from "react";
import { Link } from "react-router-dom";
import profile from "../assets/images/profile.png";

function Navbar() {
    return (
      <div className="bg-white m-5 p-5 shadow-lg rounded-2xl align-center justify-center">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <div className="mr-7">
              <Link to="/">
              <h2 className="text-2xl text-slate-900 "
                style={{ 
                  fontFamily: 'Lexend', 
                  color: '#4D4D4D', 
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >CodeCrafters</h2>
              </Link>
            </div>
            <div className="mr-7">
              <Link to="/404" style={{color: '#4D4D4D'}}>Sobre nosotros</Link>
            </div>
            <div className="mr-7">
              <Link to="/404" style={{color: '#4D4D4D'}}>Proximamente</Link>
            </div>
            <div className="mr-7">
              <Link to="/404" style={{color: '#4D4D4D'}}>Contacto</Link>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div 
              className="rounded-full p-2 px-4 text-center mr-7"
              style={{backgroundColor: '#F4F3F3'}}
            >
              <Link to="/addcourse">Publica una clase</Link>
            </div>
            <div 
              className="rounded-full p-2 px-4 text-center shadow-md"
              style={{backgroundColor: '#00ABD0'}}
            >
              <Link to="/profile" className="flex">
                <img src={profile} alt="profile" className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Navbar;