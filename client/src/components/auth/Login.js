import  React , { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {login } from '../../actions/auth';

const Login = ({login, isAuthenticated}) => {
  const [formData, setFormData] = useState( {
    email: '',
    password: ''

  });

  const { email, password } = formData;

  const onChange = e => {
    console.log(e.target.value, 'the value')
        setFormData({...formData, [e.target.name]: e.target.value});
  }



  const onSubmit = async e => {
    e.preventDefault();
    console.log(email, password, 'zhe data')
    login(email, password);
    console.log('SUCCESS')
  }

  //redirect if logged console.log(require('util').inspect(, { depth: null }));
  if(isAuthenticated) {
    return <Redirect to="/dashboard" />
  }
  return (
    <Fragment>
    <div className="_regist-wrapper">
       <h1 className="large text-primary space"> Sign In </h1>
       <p className="lead" ><i className="fas fa-user"></i> Sign into your account</p>
       <form onSubmit={e => onSubmit(e)} className="form">

           <div className="form-group">
             <input type="email"
                     name="email"
                    placeholder="Email Address"
                    onChange={e =>  onChange(e)}
                    />
            </div>
          <div className="form-group">
            <input type="password"
                name="password"
              onChange={e =>  onChange(e)}
              placeholder="Password" />
          </div>
          <input type="submit" value="Sign In" className="btn btn-primary"/>
       </form>
       <p className="my-1"> Don't have an account? <Link to ='/register' className="link login-link">Sign up</Link>
       </p>
    </div>
      </Fragment>
  )
}
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}
const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
