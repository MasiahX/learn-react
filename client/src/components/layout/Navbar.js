import React from 'react';
import { Link } from 'react-router-dom';
import '../../Navbar.css';

const Navbar = () => {
  return (
      <nav>
          <h1>
           <Link to ='/' className="link link-nav">
        <i className="fas fa-code"></i>  DevConnector
            </Link> </h1>
          <ul>
            <li><Link to ='/developer' className="link link-nav">Developers</Link></li>
            <li><Link to ='/register'  className="link link-nav">Register</Link></li>
            <li><Link to ='/login'     className="link link-nav">Login</Link></li>
          </ul>
      </nav>

  )
}

export default Navbar;
