const USER_KEY = 'user';

type UserType = {
  username: string,
  token: string,
  balance: number
};

const INITIAL_VALUE = {
  username: '',
  token: '',
  balance: 0,
};

export const getUser = () => {
  if (!localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_VALUE));
  }

  return JSON.parse(localStorage.getItem(USER_KEY) || '');
};

export const saveUser = (user: UserType) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const getToken = () => {
  const { token } = getUser();

  return token;
};