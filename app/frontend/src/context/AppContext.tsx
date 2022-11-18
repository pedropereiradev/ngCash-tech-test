import React, { useState, FC, createContext, useEffect } from 'react';
import { getAllTransactions, getAllUsers, getBalance, getUserAccountInfo } from '../services/api';
import { IAccount, IOrder, ITransaction, IUser } from '../services/interfaces';

type AppProviderProps = {
  children: React.ReactNode
};



interface IAppContext {
  user: IUser
  accounts: IAccount[]
  transactions: ITransaction[]
  order: IOrder
  loading: boolean
  setTransactions: React.Dispatch<React.SetStateAction<never[]>>
  setOrder: React.Dispatch<React.SetStateAction<IOrder>>
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  clearFilters: () => void
}

const defaultState = {
  user: { id: '', balance: '', username: '', accountId: '' },
  accounts: [],
  transactions: [],
  order: { orderBy: '', date: '' },
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
  const [order, setOrder] = useState({ orderBy: '', date: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    async function dashboardRenderData() {
      setLoading(true);
      const userAccountInfo = await getUserAccountInfo();
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
    dashboardRenderData();
  }, []);

  const clearFilters = () => {
    setOrder({ orderBy: '', date: '' });
  };

  const contextValue = {
    user,
    accounts,
    transactions,
    order,
    setTransactions,
    setOrder,
    setUser,
    clearFilters,
    loading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};