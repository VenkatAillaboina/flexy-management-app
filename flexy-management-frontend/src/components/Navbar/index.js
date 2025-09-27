import { NavLink } from 'react-router-dom';
import { FaHome, FaList, FaMapMarkedAlt, FaEnvelope } from 'react-icons/fa';
import './index.css';

const Navbar = () => {
  return (
    <header className="main-header">
      <div className="nav-logo">
        <img src="https://framerusercontent.com/images/jvU92e3wua5TEY21eh31gwlg9xs.png" alt="Logo" />
        <span className="nav-title">Tapza HoardMgmt</span>
      </div>
      <nav className="nav-links">
        <NavLink to="/">
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>
        <NavLink to="/notes">
          <FaList className="nav-icon" />
          <span className="nav-text">View All Flexys</span>
        </NavLink>
        <NavLink to="/route-finder">
            <FaMapMarkedAlt className="nav-icon" />
            <span className="nav-text">Route Finder</span>
        </NavLink>
        <NavLink to="/contact">
            <FaEnvelope className="nav-icon" />
            <span className="nav-text">Contact Admin</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;