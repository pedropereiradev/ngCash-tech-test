import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { saveUser } from '../services/userLocalStorage';

type LoginFormData = {
  username: string
  password: string
};

function Login() {
  const { handleSubmit, register } = useForm<LoginFormData>();
  const [showMessage, setShowMessage] = React.useState(false);
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const loginData = await login(data);

    if (loginData.token) {
      saveUser({
        token: loginData.token,
        username: data.username,
        balance: 0,
      });

      navigate('/dashboard');
    }
    
    if (loginData.code) setShowMessage(true);
  });

  return (
    <>
      <h1>Login Page</h1>
      <section>
        <form>
          <input type="text" placeholder="Username" {...register('username', { required: true })} />
          <input type="password" placeholder="Password" {...register('password', { required: true })} />
          <button
            type='submit'
            onClick={onSubmit}
          >
            Login
          </button>
        </form>
        <span>{showMessage ? 'Invalid username or password' : ''}</span>
      </section>
    </>
  );
}

export default Login;