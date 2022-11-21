import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Initial from './pages/Initial';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/' element={<Initial />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
