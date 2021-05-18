import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import SignInUp from './components/SignInUp';
import Skills from './components/Skills';
import UserCompleteProfile from './components/UserCompleteProfile';
import BasicInfo from './components/BasicInfo';
import React, { useState } from 'react'

function App() {
  const [IS_Authenticated, set_IS_Authenticated] = useState(false)

  return (
    <div className="App">
      <Route exact path="/"       render={() => <SignInUp type="SignUp"/> } />
      <Route exact path="/SignUp" render={() => <SignInUp type="SignUp" /> } />
      <Route exact path="/SignIn" render={() => <SignInUp type="SignIn" /> } />
      <Route exact path="/BasicInfo" render={() => <BasicInfo /> } />
      <Route exact path="/Skills" render={() => <Skills /> } />
      <Route exact path="/UserCompleteProfile" render={() => <UserCompleteProfile /> } />
    </div>
  );
}

export default App;
