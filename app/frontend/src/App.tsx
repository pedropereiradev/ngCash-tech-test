import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Initial from './pages/Initial';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Initial />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
   </Routes>
  );
}

export default App;
