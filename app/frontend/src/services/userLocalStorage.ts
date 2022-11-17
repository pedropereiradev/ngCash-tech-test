const TOKEN_KEY = 'token';


export const getToken = (): string => {
  if (!localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(''));
  }

  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '');
};

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, JSON.stringify(token));

export const logout = () => localStorage.removeItem(TOKEN_KEY);