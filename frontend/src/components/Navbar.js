import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          📰 Lecteur RSS
        </Link>
        
        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/feeds/new">
            ➕ Ajouter un flux
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 