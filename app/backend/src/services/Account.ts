import Accounts from '../database/models/Accounts';
import Users from '../database/models/Users';

export default class AccountService {
  constructor(private accountModel: typeof Accounts, private userModel: typeof Users) { }

  private async getUserAccountId(username: string): Promise<string | null> {
    const result = await this.userModel.findOne({
      where: {
        username,
      },
      include: [{ model: Accounts }],
    });

    return result?.accountId || null;
  }

  public async getBalance(username: string) {
    const accountId = await this.getUserAccountId(username);

    if (!accountId) return null;

    return this.accountModel.findByPk(accountId);
  }
}
