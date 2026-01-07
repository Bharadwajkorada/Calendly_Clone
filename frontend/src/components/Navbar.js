import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, Users, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Scheduling App
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/event-types" 
                className={`nav-link ${isActive('/event-types') || isActive('/') ? 'active' : ''}`}
              >
                <Calendar size={16} />
                Event Types
              </Link>
            </li>
            <li>
              <Link 
                to="/availability" 
                className={`nav-link ${isActive('/availability') ? 'active' : ''}`}
              >
                <Clock size={16} />
                Availability
              </Link>
            </li>
            <li>
              <Link 
                to="/meetings" 
                className={`nav-link ${isActive('/meetings') ? 'active' : ''}`}
              >
                <Users size={16} />
                Meetings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
