import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAccountInfo } from '../services/api';

function Initial() {
  const navigate = useNavigate();

  React.useEffect(() => {
    async function validateToken() {
      const result = await getUserAccountInfo();

      if (result.username) navigate('/dashboard');
    }

    validateToken();
  }, []);

  return (
    <>
      <h1>Welcome to NGCash</h1>
      <section>
        <button type='button' onClick={() => navigate('/login')}>Login</button>
        <button type='button' onClick={() => navigate('/register')}>Register</button>
      </section>
    </>
  );
}

export default Initial;