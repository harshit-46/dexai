import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/LoginPage';
import Signup from './components/Auth/SignUp';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './pages/Home';
import VerifyEmail from './pages/VerifyEmail';
import AuthRoute from './components/Auth/AuthRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/dashboard" element={
          <AuthRoute>
            <Home />
          </AuthRoute>}/>
      <Route path="/forgotpassword" element={<ForgotPassword/>} />
    </Routes>
  );
};

export default App;



/*

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GeminiComponent from './components/Gemini';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GeminiComponent/>} />
    </Routes>
  );
};

export default App;


*/