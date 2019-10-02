import  React , { Fragment, useEffect } from 'react';
import  { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import  Navbar    from './components/layout/Navbar';
import  Landing   from './components/layout/Landing';
import  Alert     from './components/layout/Alert';
import  Login     from './components/auth/Login';
import  Register  from './components/auth/Register';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import store from './store';

import  './App.css';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
     store.dispatch(loadUser());
  }, [])

return (
  <Router>
    <Fragment >
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Alert />
       <Switch>
        <Route path="/register" component={Register}/>
        <Route path="/login"    component={Login}/>

       </Switch>
      </section>
    </Fragment>
  </Router>
)
}





export default App;
