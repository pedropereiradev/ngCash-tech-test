import React, { useState, FC, createContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllTransactions, getAllUsers, getBalance, getUserAccountInfo } from '../services/api';
import { IAppContext } from '../services/interfaces';
import { getToken } from '../services/userLocalStorage';

type AppProviderProps = {
  children: React.ReactNode
};

const defaultState = {
  user: { id: '', balance: '', username: '', accountId: '' },
  accounts: [],
  transactions: [],
  order: { orderBy: 'all', date: '' },
  loading: true,
  setTransactions: () => [],
  setOrder: () => {},
  setUser: () => { },
  clearFilters: () => {},
};

export const AppContext = createContext<IAppContext>(defaultState);

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState({ id: '', balance: '', username: '', accountId: '' });
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [order, setOrder] = useState({ orderBy: 'all', date: '' });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => { 
    async function dashboardRenderData() {
      const token = getToken();
      const userAccountInfo = await getUserAccountInfo();

      if (token && userAccountInfo.username) {
        const userBalanceResult = await getBalance();
        const userAccounts = await getAllUsers();
        const userTransactions = await getAllTransactions();

        setUser((prevState) => ({
          ...prevState,
          ...userBalanceResult,
          ...userAccountInfo,
        }));
        setAccounts(userAccounts);
        setTransactions(userTransactions);
        setLoading(false);
      }
    }
    dashboardRenderData();
    
  }, [location]);

  const clearFilters = () => {
    setOrder({ orderBy: 'all', date: '' });
  };

  const contextValue = {
    user,
    accounts,
    transactions,
    order,
    loading,
    setTransactions,
    setOrder,
    setUser,
    clearFilters,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};