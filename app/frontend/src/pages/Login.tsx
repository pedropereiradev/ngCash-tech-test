import { Box, Button, Container, FormControl, FormHelperText, Paper, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { login } from '../services/api';
import { saveToken } from '../services/userLocalStorage';

type LoginFormData = {
  username: string
  password: string
};

function Login() {
  const { handleSubmit, register, formState: { errors } } = useForm<LoginFormData>();
  const [showMessage, setShowMessage] = React.useState('');
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const loginData = await login(data);

    if (loginData.token) {
      saveToken(loginData.token);
      navigate('/dashboard');
    }
    
    if (loginData.code) setShowMessage(loginData.response.data.message);
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
                    {...register('username', { required: true })}
                  />
                  <FormHelperText error>{errors.username?.message}</FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id='password'
                    type='password'
                    label='Senha'
                    variant='outlined'
                    {...register('password', { required: true })}
                  />
                  <FormHelperText error>{errors.password?.message}</FormHelperText>
                </FormControl>

                <FormHelperText error>{showMessage}</FormHelperText>

                <Button
                  variant="contained"
                  size="large"
                  onClick={onSubmit}
                >
                  Login
                </Button>
                </Stack>
              </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Login;