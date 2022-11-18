import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { logout } from '../services/userLocalStorage';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="a"
            href='/dashboard'
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
              fontSize: {
                sm: '1rem',
                xs: '0.9rem',
              },
            }}>
            NG.Cash
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Box marginRight={2}>
              <Typography
                variant='h6'
                component='p'
                sx={{
                  fontSize: {
                    sm: '1rem',
                    xs: '0.8rem',
                  },
                }}
              >
                Olá {user.username}
              </Typography>
              <Typography
                variant='h6'
                component='p'
                sx={{
                  fontSize: {
                    sm: '1rem',
                    xs: '0.8rem',
                  },
                }}
              >
                Saldo atual: R${Number(user.balance).toFixed(2).replace('.', ',')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default DashboardHeader;