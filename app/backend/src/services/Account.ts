import Accounts from '../database/models/Accounts';
import Users from '../database/models/Users';
import Token from './utils/Token';

export default class AccountService {
  constructor(private accountModel: typeof Accounts, private userModel: typeof Users) { }

  private async getUserAccountId(id: string): Promise<string | null> {
    const result = await this.userModel.findByPk(id, {
      include: [{ model: Accounts }]
    });

    return result?.accountId || null;
  }


  public async getBalance(userId: string) {
    const accountId = await this.getUserAccountId(userId);

    if (!accountId) return null;

    return this.accountModel.findByPk(accountId);
  }
}