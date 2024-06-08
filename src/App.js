import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './layouts/Footer';
import ProjectRoutes from './Routes'; // Import your routes from Routes.js
import "./assets/css/App.css";
import backgroundImage from './assets/images/bola-color.png'; 

function App() {
  return (
    <div className="App flex flex-col min-h-screen" style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }}>
      <Router>
        <div className="flex-grow">
          <ProjectRoutes />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
