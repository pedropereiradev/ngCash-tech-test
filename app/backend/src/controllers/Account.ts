import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Token from '../services/utils/Token';
import AccountService from '../services/Account';
import { JwtPayload } from 'jsonwebtoken';

export default class AccountController {
  constructor(private accountSevice: AccountService) { }

  public async getBalance(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      const tokenPayload = Token.validate(authorization as string) as JwtPayload;

      if (!authorization || !tokenPayload) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const result = await this.accountSevice.getBalance(tokenPayload.username);

      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User account not found' });
      }

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
}