import axios from 'axios';

const LOGIN_ENDPOINT = process.env.LOGIN_ENDPOINT || 'http://localhost:3001/login';
const USER_REGISTER_ENDPOINT = process.env.USER_REGISTER_ENDPOINT || 'http://localhost:3001/user';

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

export async function userRegister(registerParams: UserType) {
  try {
    const { data } = await axios.post(USER_REGISTER_ENDPOINT, registerParams);

    return data;
  } catch (error) {
    return error;
  }
}