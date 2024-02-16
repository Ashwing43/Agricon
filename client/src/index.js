import React from 'react';
import Login from "./login.component";
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from './history';
import RegisterBusiness from "./RegisterBusiness";
import RegisterFarmer from "./RegisterFarmer";
import AdminLayout from "./layouts/Admin/Admin";
import Admin1 from "./layouts/Admin/Admin1";
import Business from "./layouts/Admin/Business";
import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import Help from './Help';

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/RegisterBusiness" component={RegisterBusiness} />
          <Route path="/RegisterFarmer" component={RegisterFarmer} />
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Route path="/Admin1" render={(props) => <Admin1 {...props} />} />
          <Route path="/Business" render={(props) => <Business {...props} />} />
          <Route exact path='/Help' component={Help} /> 
        </Switch>
      </Router>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById('root')
);

reportWebVitals();