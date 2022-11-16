import axios from 'axios';

const LOGIN_ENDPOINT = process.env.LOGIN_ENDPOINT || 'http://localhost:3001/login';

type UserType = {
  username: string
  password: string
};

export async function login({ username, password }: UserType) {
  try {
    const { data } = await axios.post(LOGIN_ENDPOINT, { username, password });

    return data;
  } catch (error) {
    return error;
  }
}