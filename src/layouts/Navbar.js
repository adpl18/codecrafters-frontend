import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
      <div>
        <Link to="/">Inicio</Link>
        <Link to="/profile">Perfil</Link>
        <Link to="/addcourse">Publica una clase</Link>
      </div>
    );
}

export default Navbar;