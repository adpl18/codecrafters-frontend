import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './layouts/Footer';
import Navbar from './layouts/Navbar';
import ProjectRoutes from './Routes';
import backgroundImage from './assets/images/bola-color.png'; 
import "./assets/css/App.css";

function App() {
  return (
    <div className="App flex flex-col min-h-screen" style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }}>
      <Router>
        <Navbar />
        <div className="flex-grow">
          <ProjectRoutes />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
