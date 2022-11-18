import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { logout } from '../services/userLocalStorage';

function DashboardHeader() {
  const {
    user,
  } = React.useContext(AppContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section>
      <h1>Dashboard</h1>
      <section>
        <p>username: {user.username}</p>
        <p>balance: R${Number(user.balance).toFixed(2).replace('.', ',')}</p>
        <button type='button' onClick={handleLogout} >Log out</button>
      </section>
    </section>
  );
}

export default DashboardHeader;