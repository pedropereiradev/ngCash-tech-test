// import React from 'react';
import * as api from '../../services/api';
import * as tokenService from '../../services/userLocalStorage';
import { screen } from '@testing-library/react';
import Initial from '../../pages/Initial';
import App from '../../App';
import renderWithrouter from '../helpers/renderWithRouter';
import { accounts } from '../mocks/accounts';
import { transactions } from '../mocks/transactions';

jest.mock('axios');

const appContext = {
  user: { id: '1', balance: '100', username: 'Mock', accountId: '123' },
  accounts: [],
  transactions: [],
  order: { orderBy: 'all', date: '' },
  loading: false,
}

describe('Iniital page', () => {
  describe('Render', () => {
    it('Should render all components successfully', async () => {
      renderWithrouter(<Initial />);

      const loginButton = screen.getAllByRole('button', { name: /Login/i });
      const registerButton = screen.getAllByRole('button', { name: /Criar conta/i });

      expect(loginButton.length).toBe(2);
      expect(registerButton.length).toBe(2);

      expect(loginButton[0]).toBeInTheDocument();
      expect(registerButton[0]).toBeInTheDocument();
    });
  });
  describe('Buttons behavior', () => {
    it('Should redirect to login page when navbar login button is clicked', async () => {
      const {user} = renderWithrouter(<App />, {route: '/'});

      const loginButton = screen.getAllByRole('button', { name: /Login/i });

      user.click(loginButton[0]);

     
      const usernameInput = screen.getByLabelText(/username/i);
      
      expect(usernameInput).toBeInTheDocument()
    });

    it('Should redirect to login page when page login button is clicked', async () => {
      const {user} = renderWithrouter(<App />, {route: '/'});

      const loginButton = screen.getAllByRole('button', { name: /Login/i });

      user.click(loginButton[1]);

      const usernameInput = screen.getByLabelText(/username/i);
      
      expect(usernameInput).toBeInTheDocument()
    });

     it('Should redirect to register page when navbar register button is clicked', async () => {
      const {user} = renderWithrouter(<App />, {route: '/'});

      const registerButton = screen.getAllByRole('button', { name: /Criar conta/i });

      user.click(registerButton[0]);

     
      const usernameInput = screen.getByLabelText(/confirmar senha/i);
      
      expect(usernameInput).toBeInTheDocument()
    });

    it('Should redirect to register page when page register button is clicked', async () => {
      const {user} = renderWithrouter(<App />, {route: '/'});

      const registerButton = screen.getAllByRole('button', { name: /Criar conta/i });

      user.click(registerButton[1]);

      const usernameInput = screen.getByLabelText(/confirmar senha/i);
      
      expect(usernameInput).toBeInTheDocument()
    });
  });
  describe('App behavior', () => {
    it('Should redirect to dashboard page when have a valid token already', async () => {
      api.getUserAccountInfo = jest.fn().mockImplementation(async () => ({ username: 'Mocked' }));
      api.getAllUsers = jest.fn().mockImplementation(async () => (accounts));
      api.getAllTransactions = jest.fn().mockImplementation(async () => (transactions));
      
      tokenService.getToken = jest.fn().mockImplementation(async () => 'fakeToken');
      
      renderWithrouter(<App />, { route: '/' }, appContext);  
      
      const transferTitle = await screen.findByRole('heading', {level: 2})
      
      expect(transferTitle).toBeInTheDocument()
    })
  })
});