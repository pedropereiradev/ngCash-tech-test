// import React from 'react';
import * as api from '../../services/api';
import * as tokenService from '../../services/userLocalStorage';
import { cleanup, screen } from '@testing-library/react';
import Initial from '../../pages/Initial';
import App from '../../App';
import renderWithrouter from '../helpers/renderWithRouter';
import { accounts } from '../mocks/accounts';
import { transactions } from '../mocks/transactions';
import { appContext } from '../mocks/appContext';
import Register from '../../pages/Register';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

describe('Register page', () => {
  describe('Render', () => {
    it('Should render all components successfully', async () => {
      renderWithrouter(<Register />);

      const inputUsername = screen.getByLabelText(/username/i);
      const passwordUsername = screen.getByLabelText(/^senha/i);
      const confirmPasswordUsername = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      expect(inputUsername).toBeInTheDocument();
      expect(passwordUsername).toBeInTheDocument();
      expect(confirmPasswordUsername).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });
  describe('App behavior', () => {
    beforeEach(() => {
      api.getUserAccountInfo = jest.fn().mockImplementation(async () => ({ username: 'Mocked' }));
      api.getAllUsers = jest.fn().mockImplementation(async () => (accounts));
      api.getAllTransactions = jest.fn().mockImplementation(async () => (transactions));
    })

    afterEach(() => cleanup);

    it('Should create an account successfully', async () => {
      api.userRegister = jest.fn().mockImplementation(async () => ({token: 'fakeToken'}))
      
      const {user} = renderWithrouter(<App />, { route: '/register' }, appContext);  

      const inputUsername = screen.getByLabelText(/username/i);
      const inputPassword = screen.getByLabelText(/^senha/i);
      const inputConfirmPassword = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      user.type(inputUsername, 'user');
      user.type(inputPassword, 'User1234');
      user.type(inputConfirmPassword, 'User1234');
      user.click(button);

      const transferTitle = await screen.findByRole('heading', {level: 2})
      expect(transferTitle).toBeInTheDocument()
    })
    
    it('Should not allow create an account without username', async () => {
      api.userRegister = jest.fn().mockImplementation(async () => ({token: 'fakeToken'}))
      
      const {user} = renderWithrouter(<App />, { route: '/register' }, appContext);  

      const inputUsername = screen.getByLabelText(/username/i);
      const inputPassword = screen.getByLabelText(/^senha/i);
      const inputConfirmPassword = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      user.type(inputUsername, '');
      user.type(inputPassword, 'User1234');
      user.type(inputConfirmPassword, 'User1234');
      user.click(button);

      const errorMessage = await screen.findByText(/username é necessário/i);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Should not allow create an account without valid username', async () => {
      api.userRegister = jest.fn().mockImplementation(async () => ({token: 'fakeToken'}))
      
      const {user} = renderWithrouter(<App />, { route: '/register' }, appContext);  

      const inputUsername = screen.getByLabelText(/username/i);
      const inputPassword = screen.getByLabelText(/^senha/i);
      const inputConfirmPassword = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      user.type(inputUsername, 'us');
      user.type(inputPassword, 'User1234');
      user.type(inputConfirmPassword, 'User1234');
      user.click(button);

      const errorMessage = await screen.findByText(/Username precisa ter ao menos 3 caracteres/i);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Should not allow create an account without invalid password format', async () => {
      api.userRegister = jest.fn().mockImplementation(async () => ({token: 'fakeToken'}))
      
      const {user} = renderWithrouter(<App />, { route: '/register' }, appContext);  

      const inputUsername = screen.getByLabelText(/username/i);
      const inputPassword = screen.getByLabelText(/^senha/i);
      const inputConfirmPassword = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      user.type(inputUsername, 'user');
      user.type(inputPassword, 'user1234');
      user.type(inputConfirmPassword, 'user1234');
      user.click(button);

      const errorMessage = await screen.findByText(/Senha precisa ter pelo menos 8 dígitos, 1 número e 1 letra maiúscula/i);
      expect(errorMessage).toBeInTheDocument();
     })
    
     it('Should not allow create an account without different passwords', async () => {
      api.userRegister = jest.fn().mockImplementation(async () => ({token: 'fakeToken'}))
      
      const {user} = renderWithrouter(<App />, { route: '/register' }, appContext);  

      const inputUsername = screen.getByLabelText(/username/i);
      const inputPassword = screen.getByLabelText(/^senha/i);
      const inputConfirmPassword = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      user.type(inputUsername, 'user');
      user.type(inputPassword, 'User1234');
      user.type(inputConfirmPassword, 'User3456');
      user.click(button);

      const errorMessage = await screen.findByText(/Senhas não coincidem/i);
      expect(errorMessage).toBeInTheDocument();
     })
    
     it('Should not allow create an account that already exists', async () => {
      api.userRegister = jest.fn().mockImplementation(async () => ({code: 409, response: {data: {message: 'Usuário já existe'}}}))
      
      const {user} = renderWithrouter(<App />, { route: '/register' }, appContext);  

      const inputUsername = screen.getByLabelText(/username/i);
      const inputPassword = screen.getByLabelText(/^senha/i);
      const inputConfirmPassword = screen.getByLabelText(/confirmar senha/i);
      const button = screen.getByRole('button', { name: /Cadastrar/i });

      user.type(inputUsername, 'user');
      user.type(inputPassword, 'User1234');
      user.type(inputConfirmPassword, 'User1234');
      user.click(button);

      const errorMessage = await screen.findByText(/Usuário já existe/i);
      expect(errorMessage).toBeInTheDocument();
    })
  })
});