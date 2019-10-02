import  React , { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import '../../Register.css';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import axios from 'axios';

const Register = ({setAlert, register, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });


const { name, email, password, password2 } = formData;

const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

const onSubmit = async e => {
  e.preventDefault();
  if(password !== password2) {
     setAlert('Passwords do not match', 'danger')
  } else {
    const newUser = {
      name,
      email,
      password
    }

   register({name, email, password})
    // try {
    //   const config = {
    //     headers : {
    //       'Content-Type': 'application/json'
    //     }
    //   }
    //
    //   const body = JSON.stringify(newUser);
    //
    //   const res = await axios.post('/api/users', body, config);
    //   console.log(res, 'resdata')
    // } catch(err) {
    //   console.error(err.response.data)
    // }
    console.log(formData)
  }
}

//redirect if logged console.log(require('util').inspect(, { depth: null }));
if(isAuthenticated) {
  return <Redirect to="/dashboard" />
}
  return (
  <Fragment>
    <div className="_regist-wrapper">
       <h1 className="large text-primary space"> Sign up </h1>
       <p className="lead" ><i className="fas fa-user"></i> Create Your Account</p>
       <form className="form" onSubmit={e => onSubmit(e)}>
           <div className="form-group">
             <input
               type="text"
               placeholder="Name"
               name="name"
               value={name}
               onChange={ e =>onChange(e)}

               />
           </div>
           <div className="form-group">
             <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={e => onChange(e)}

                />
             <small className="form-text">This site uses Gravatar,
              so if you want a profile image, use a Gravatar email
             </small>
            </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={e =>  onChange(e)}

              />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={e =>  onChange(e)}

              />
          </div>
          <input type="submit" value="Register" className="btn btn-primary"/>
       </form>
       <p className="my-1"> Already have an account? <Link to ='/login' className="link login-link">Sign In</Link>
       </p>
    </div>
</Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { setAlert, register })(Register);
