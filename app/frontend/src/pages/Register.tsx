import { Box, Button, Container, FormControl, FormHelperText, Paper, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
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
      <NavBar />
      <Box
        component="section"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Container sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Paper
            elevation={16}
            sx={{
              p: 5,
              height: '65vh',
              width: '70vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="form"
              sx={{
                '& > :not(style)': {
                  m: 1,
                },
              }}
              noValidate
              autoComplete="off"
            >
              <Stack
                sx={{ width: { xs: '98%', sm: 500 } }}
                spacing={2}
                alignItems="center"
              >
                <FormControl fullWidth>
                  <TextField
                    id='username'
                    label='Username'
                    variant='outlined'
                    {...register('username', { required: 'Username is required', minLength: 3 })}
                  />
                  <FormHelperText error>
                    {errors.username?.message}
                    {(errors.username?.type) === 'minLength' && 'Username must have at least 3 characters'}
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id='password'
                    type='password'
                    label='Senha'
                    variant='outlined'
                    {...register('password', { required: 'Password is required', pattern: /^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/ })}
                  />
                  <FormHelperText error>
                    {errors.password?.message}
                    {(errors.password?.type) === 'pattern' && 'Password must have at least 8 characters, one number and one capital letter'}
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id='confirmPassword'
                    type='password'
                    label='Confirmar senha'
                    variant='outlined'
                    {...register('confirmPassword', { required: true })}
                  />
                  <FormHelperText error>{errors.confirmPassword?.message}</FormHelperText>
                </FormControl>

                <FormHelperText error>{showMessage}</FormHelperText>

                <Button
                  variant="contained"
                  size="large"
                  onClick={onSubmit}
                >
                  Cadastrar
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Register;