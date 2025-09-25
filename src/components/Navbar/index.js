import { NavLink } from 'react-router-dom';
import './index.css';

const Navbar = () => {
  return (
    <nav className="main-nav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/notes">View All Flexys</NavLink>
    </nav>
  );
};

export default Navbar;