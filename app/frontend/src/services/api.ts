import axios from 'axios';
import { getToken } from './userLocalStorage';

const LOGIN_ENDPOINT = process.env.LOGIN_ENDPOINT || 'http://localhost:3001/login';
const USER_ENDPOINT = process.env.USER_ENDPOINT || 'http://localhost:3001/user';
const USER_BALANCE_ENDPOINT = process.env.USER_BALANCE_ENDPOINT || 'http://localhost:3001/account/balance';
const USERS_ACCOUNTS_ENDPOINT = process.env.USERS_ACCOUNTS_ENDPOINT || 'http://localhost:3001/user/all'; 
const TRANSACTION_ENDPOINT = process.env.TRANSACTION_ENDPOINT || 'http://localhost:3001/transaction';

type UserData = {
  username: string
  password: string
};

type TransactionData = {
  originAccount: string
  destinationAccount: string
  value: number
};

export async function login({ username, password }: UserData) {
  try {
    const { data } = await axios.post(LOGIN_ENDPOINT, { username, password });

    return data;
  } catch (error) {
    return error;
  }
}

export async function userRegister(registerParams: UserData) {
  try {
    const { data } = await axios.post(USER_ENDPOINT, registerParams);

    return data;
  } catch (error) {
    return error;
  }
}

export async function getBalance() {
  try {
    const { data } = await axios.get(USER_BALANCE_ENDPOINT, {
      headers: { 'authorization': getToken() },
    });

    return data;
  } catch (error) {
    return error;
  }
}

export async function getUserAccountInfo() {
  try {
    const { data } = await axios.get(USER_ENDPOINT, {
      headers: { 'authorization': getToken() },
    });

    return data;
  } catch (error) {
    return error;
  }
}

export async function getAllUsers() {
  try {
    const { data } = await axios.get(USERS_ACCOUNTS_ENDPOINT, {
      headers: { 'authorization': getToken() },
    });

    return data;
  } catch (error) {
    return error;
  }
}

export async function createTransaction(transactionParams:TransactionData) {
  try {
    const { data } = await axios.post(TRANSACTION_ENDPOINT, transactionParams, {
      headers: { 'authorization': getToken() },
    });

    return data;
  } catch (error) {
    return error;
  }
}

export async function getAllTransactions() {
  try {
    const { data } = await axios.get(TRANSACTION_ENDPOINT, {
      headers: { 'authorization': getToken() },
    });

    return data;
  } catch (error) {
    return error;
  }
}

export async function getFilteredTransactions(transactionType: string, date: string) {
  try {
    const { data } = await axios.get(TRANSACTION_ENDPOINT, {
      headers: { 'authorization': getToken() },
      params: {
        transactionType,
        date,
      },
    });

    return data;
  } catch (error) {
    return error;
  }
}