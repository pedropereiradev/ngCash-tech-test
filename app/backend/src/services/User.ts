import { IUser } from '../interfaces/IUser';
import Users from '../database/models/Users';
import BCrypt from './utils/Bcrypt';
import Token from './utils/Token';
import db from '../database/models';
import Accounts from '../database/models/Accounts';
import { Op } from 'sequelize';


export default class UserService {
  constructor(private userModel: typeof Users, private accountModel: typeof Accounts) { }

  private async validateUser(username: string): Promise<Users | null> {
    const result = await this.userModel.findOne({
      where: { username }
    })

    return result;
  }

  private async isValidLogin({ username, password }: IUser): Promise<true | null> {
    const isUserExists = await this.validateUser(username);

    if (!isUserExists || !BCrypt.compare(isUserExists.password, password)) return null;

    return true;
  }

  public async login(loginParams: IUser) {
    const validLogin = await this.isValidLogin(loginParams);

    if (!validLogin) return null;

    return Token.generate(loginParams.username);
  }

  public async create({ username, password }: IUser) {
    const isUserExists = await this.validateUser(username);

    if (isUserExists) return null

    const t = await db.transaction();

    try {
      const accountCreate = await this.accountModel.create({
        balance: 100,
      }, { transaction: t });

      await this.userModel.create({
        username,
        password: BCrypt.create(password),
        accountId: accountCreate.id
      }, { transaction: t })

      await t.commit();

      return Token.generate(username);
    } catch (error) {
      await t.rollback();

      console.error(error);

      return null;
    }
  }

  public async getAll(username: string) {
    return this.userModel.findAll({
      where: {
        username: { [Op.ne]: username }
      },
      attributes: {
        exclude: ['id', 'password']
      }
    })
  }

  public async getUser(username: string) {
    return this.userModel.findOne({
      where: {
        username
      },
      attributes: {
        exclude: ['id', 'password']
      }
    })
  }
}