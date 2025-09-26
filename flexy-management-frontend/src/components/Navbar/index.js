import { NavLink } from 'react-router-dom';
import { FaHome, FaList } from 'react-icons/fa';
import './index.css';

const Navbar = () => {
  return (
    <nav className="main-nav">
      <div className="nav-logo">
        <img src="https://framerusercontent.com/images/jvU92e3wua5TEY21eh31gwlg9xs.png" alt="Logo" />
      </div>
      <div className="nav-links">
        <NavLink to="/">
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>
        <NavLink to="/notes">
          <FaList className="nav-icon" />
          <span className="nav-text">View All Flexys</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;