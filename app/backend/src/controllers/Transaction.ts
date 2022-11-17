import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Token from '../services/utils/Token';
import TransactionsService from '../services/Transaction';
import { ITransaction } from '../interfaces/ITransaction';
import { JwtPayload } from 'jsonwebtoken';

export default class TransactionController {
  constructor(private transactionService: TransactionsService) { }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      if (!authorization || !Token.validate(authorization)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const { originAccount, destinationAccount, value } = req.body as ITransaction;

      const result = await this.transactionService.create({ originAccount, destinationAccount, value })

      if (result?.message && result?.status) {
        return res.status(result.status).json({ message: result.message });
      }

      return res.status(StatusCodes.CREATED).end();

    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }

  private async getAllWithFilters(username: string, isCashIn: string, date: string) {
    
    if (isCashIn && date) {
      return await this.transactionService.getAllByDateAndCashInOrCashOut(username, date, isCashIn === 'true');
    } else {
      if (isCashIn && !date) return await this.transactionService.getAllByCashInOrCashOut(username, isCashIn === 'true');
      if (!isCashIn && date) return await this.transactionService.getAllByDate(username, date);

      return await this.transactionService.getAll(username);
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      const tokenPayload = Token.validate(authorization as string) as JwtPayload;

      if (!authorization || !tokenPayload) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const { isCashIn, date } = req.query;

      const result = await this.getAllWithFilters(tokenPayload.username, isCashIn as string, date as string);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
}