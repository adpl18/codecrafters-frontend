// Footer
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
      <footer className="footer p-5 bg-gray-400 text-gray-800">
        <div className="flex justify-between px-10 md:px-20 lg:px-40">
          <div className="flex flex-col text-left">
            <h2 className="text-xl mb-2">Descubre más</h2>
            <Link to="/404" className="normal-case text-sm">Ayuda</Link>
            <Link to="/404" className="normal-case text-sm">Acceso profesor</Link>
            <Link to="/404" className="normal-case text-sm">Acceso alumno</Link>
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-xl mb-2">Empresa</h2>
            <Link to="/404" className="normal-case text-sm">Acerca de Nosotros</Link>
            <Link to="/404" className="normal-case text-sm">Contacto</Link>
            <Link to="/404" className="normal-case text-sm">¿Buscas trabajo?</Link>
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-xl mb-2">Legal</h2>
            <Link to="/404" className="normal-case text-sm">Términos de uso</Link>
            <Link to="/404" className="normal-case text-sm">Privacidad</Link>
            <Link to="/404" className="normal-case text-sm">Uso de Cookies</Link>
          </div>
        </div>
      </footer>
    );
}

export default Footer;