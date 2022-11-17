import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../services/api';
import { saveToken } from '../services/userLocalStorage';

type RegisterFormData = {
  username: string
  password: string
  confirmPassword: string
};

function Register() {
  const { handleSubmit, register, formState: { errors } } = useForm<RegisterFormData>();
  const [showMessage, setShowMessage] = React.useState('');
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return setShowMessage('Passwords do not match');
    }

    const registerData = await userRegister(data);

    if (registerData.token) {
      saveToken(registerData.token);
      navigate('/dashboard');
    }

    if (registerData.code) setShowMessage(registerData.response.data.message);
  });

  return (
    <>
      <h1>Register Page</h1>
      <section>
        <form>
          <input type="text" placeholder="Username" {...register('username', { required: 'Username is required', minLength: 3 })} />
          <input type="password" placeholder="Password" {...register('password', { required: 'Password is required', pattern: /^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/ })} />
          <input type="password" placeholder="Confirm Password" {...register('confirmPassword', { required: 'Confirm password is required' })} />
          <button
            type='submit'
            onClick={onSubmit}
          >
            Create account
          </button>
        </form>
        <span>{showMessage}</span>
        <span>{errors.username?.message}</span>
        <span>{errors.password?.message}</span>
        <span>{errors.confirmPassword?.message}</span>
        <span>
          {(errors.username?.type) === 'minLength' && 'Username must have at least 3 characters'}
        </span>
        <span>
          {(errors.password?.type) === 'pattern' && 'Password must have at least 8 characters, one number and one capital letter'}
        </span>
      </section>
    </>
  );
}

export default Register;