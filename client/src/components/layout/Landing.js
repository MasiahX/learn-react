import React from 'react';
import { Link } from 'react-router-dom';
import '../../Landing.css';

const Landing = () => {
  return (

      <section className='_landing-wrapper'>
        <div className="dark-overlay">
          <div className="landing-inner">
             <h1 className="x-large">Developer Connector </h1>
              <p className="lead"> Create a developer profile/portfolio, share posts and get help
                  from other Developers
              </p>
            <div className="buttons">
              <Link to ='/register' className="link btn btn-primary">Sign Up</Link>
              <Link to ='/login' className="link btn btn-primary-light">Login</Link>
           </div>
         </div>
        </div>
      </section>

  )
}

export default Landing;
