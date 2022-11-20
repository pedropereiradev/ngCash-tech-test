/* eslint-disable react/jsx-filename-extension */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const renderWithrouter = (ui, { route = '/' } = {}, appContext = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent,
    ...render(
      <AppContext.Provider value={appContext}>
        {ui}
      </AppContext.Provider>,
      { wrapper: BrowserRouter },
    ),
  };
};

export default renderWithrouter;