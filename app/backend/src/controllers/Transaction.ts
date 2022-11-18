import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import Token from '../services/utils/Token';
import TransactionsService from '../services/Transaction';
import { ITransaction } from '../interfaces/ITransaction';

export default class TransactionController {
  constructor(private transactionService: TransactionsService) { }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      if (!authorization || !Token.validate(authorization)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const { originAccount, destinationAccount, value } = req.body as ITransaction;

      const result = await this.transactionService
        .create({ originAccount, destinationAccount, value });

      if (result?.message && result?.status) {
        return res.status(result.status).json({ message: result.message });
      }

      return res.status(StatusCodes.CREATED).end();
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }

  private static transactionTypeSelector(transactionType: string):string {
    switch (transactionType) {
      case 'cash-in':
        return 'creditedAccountId';
      case 'cash-out':
        return 'debitedAccountId';
      default:
        return '';
    }
  }

  private async getAllWithFilters(username: string, type: string, date: string) {
    const transactionType = TransactionController.transactionTypeSelector(type);

    if (transactionType && date) {
      return this.transactionService
        .getAllByDateAndCashInOrCashOut(username, date, transactionType);
    }
    if (transactionType && !date) {
      return this.transactionService
        .getAllByCashInOrCashOut(username, transactionType);
    }
    if (!transactionType && date) {
      return this.transactionService
        .getAllByDate(username, date);
    }

    return this.transactionService.getAll(username);
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      const tokenPayload = Token.validate(authorization as string) as JwtPayload;

      if (!authorization || !tokenPayload) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const { transactionType, date } = req.query;

      const result = await this
        .getAllWithFilters(tokenPayload.username, transactionType as string, date as string);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
}
