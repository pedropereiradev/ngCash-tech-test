import { Box, Button, Container, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
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
            <Typography
              variant="h1"
              component="h1"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: {
                  lg: '6rem',
                  md: '6rem',
                  sm: '6rem',
                  xs: '3rem',
                },
                color: 'text.primary',
              }}
            >
              Seja bem vindo ao NG.Cash
            </Typography>
            <Box sx={{ mt: 5 }}>
              <Button
                color="primary"
                size='large'
                variant='contained'
                onClick={() => navigate('/login')}
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button
                color="primary"
                size='large'
                variant='outlined'
                onClick={() => navigate('/register')}
              >
                Criar conta
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Initial;