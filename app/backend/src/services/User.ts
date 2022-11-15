import { IUserLogin } from '../interfaces/IUser';
import Users from '../database/models/Users';
import BCrypt from './utils/Bcrypt';
import Token from './utils/Token';

export default class UserService {
  constructor(private userModel: typeof Users) { }

  private async isValidUser({ username, password }: IUserLogin): Promise<true | null> {
    const result = await this.userModel.findOne({
      where: { username }
    })

    if (!result || BCrypt.compare(result.password, password)) return null;

    return true;
  }

  public async login(loginParams: IUserLogin) {
    const validUser = await this.isValidUser(loginParams);

    if (!validUser) return null;

    return Token.generate(loginParams.username);
  }
}