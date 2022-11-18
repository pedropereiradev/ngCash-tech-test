import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="a"
            href='/'
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}>
            NG.Cash
          </Typography>
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/register')}
            >
              Criar conta
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;