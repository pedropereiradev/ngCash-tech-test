import renderWithrouter from '../helpers/renderWithRouter'
import Login from '../../pages/Login';
import { act, screen } from '@testing-library/react';
import { appContext } from '../mocks/appContext';
import * as api from '../../services/api'
import * as tokenService from '../../services/userLocalStorage'
import App from '../../App';
import { accounts } from '../mocks/accounts';
import { transactions } from '../mocks/transactions';

describe('Login page', () => {
  afterEach(() => jest.clearAllMocks());

  describe('Render', () => {
    afterEach(() => jest.clearAllMocks());

    it('Should render all components successfully', async () => {
      renderWithrouter(<Login />)

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/Senha/i);
      const button = screen.getByRole('button', { name: /logar/i })
      
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    })
  })
  describe('Behavior', () => {
    afterEach(() => jest.clearAllMocks());

    describe('Success', () => {
      afterEach(() => jest.clearAllMocks());

      it('Should make login successfully', async () => {
        api.getUserAccountInfo = jest.fn().mockImplementation(() => ({ username: 'Mocked' }));
        api.getAllUsers = jest.fn().mockImplementation(() => (accounts));
        api.getAllTransactions = jest.fn().mockImplementation(() => (transactions));
        api.login = jest.fn().mockImplementation(() => ({ token: 'fakeToken' }));
      
        const { user } = renderWithrouter(<App />, { route: '/login' }, appContext);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/Senha/i);
        const button = screen.getByRole('button', { name: /logar/i });

        user.type(usernameInput, 'user');
        user.type(passwordInput, 'User1234');
        user.click(button);

        const transfer = await screen.findByRole('heading', { level: 2 });
        expect(transfer).toBeInTheDocument();
      })
    })
    describe('Failure', () => {
      afterEach(() => jest.clearAllMocks());

      it('Should not allow login without username', async () => {
        api.getUserAccountInfo = jest.fn().mockImplementation(() => ({ username: 'Mocked' }));
        api.getAllUsers = jest.fn().mockImplementation(() => (accounts));
        api.getAllTransactions = jest.fn().mockImplementation(() => (transactions));
        api.login = jest.fn().mockImplementation(() => ({ token: 'fakeToken' }));
      
        const { user } = renderWithrouter(<App />, { route: '/login' }, appContext);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/Senha/i);
        const button = screen.getByRole('button', { name: /logar/i });

        user.type(usernameInput, '');
        user.type(passwordInput, 'User1234');
        user.click(button);

        const errorMessage = await screen.findByText(/username é necessário/i);
        expect(errorMessage).toBeInTheDocument();
      })
      it('Should not allow login without password', async () => {
        api.getUserAccountInfo = jest.fn().mockImplementation(() => ({ username: 'Mocked' }));
        api.getAllUsers = jest.fn().mockImplementation(() => (accounts));
        api.getAllTransactions = jest.fn().mockImplementation(() => (transactions));
        api.login = jest.fn().mockImplementation(() => ({ token: 'fakeToken' }));
      
        const { user } = renderWithrouter(<App />, { route: '/login' }, appContext);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/Senha/i);
        const button = screen.getByRole('button', { name: /logar/i });

        user.type(usernameInput, 'user');
        user.type(passwordInput, '');
        user.click(button);

        const errorMessage = await screen.findByText(/senha é necessária/i);
        expect(errorMessage).toBeInTheDocument();
      })

      it('Should not allow login with invalid username or password', async () => {
        api.getUserAccountInfo = jest.fn().mockImplementation(() => ({ username: 'Mocked' }));
        api.getAllUsers = jest.fn().mockImplementation(() => (accounts));
        api.getAllTransactions = jest.fn().mockImplementation(() => (transactions));
        api.login = jest.fn().mockImplementation(() => ({code: 401, response: {data: {message: 'Usuário ou senha incorreta'}}}));
      
        const { user } = renderWithrouter(<App />, { route: '/login' }, appContext);

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/Senha/i);
        const button = screen.getByRole('button', { name: /logar/i });

        user.type(usernameInput, 'user');
        user.type(passwordInput, 'User1234');
        user.click(button);

        const errorMessage = await screen.findByText(/usuário ou senha incorreta/i);
        expect(errorMessage).toBeInTheDocument();
      })
    })
  })
})