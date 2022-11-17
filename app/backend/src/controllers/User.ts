import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import Token from '../services/utils/Token';
import { IUser } from '../interfaces/IUser';
import UserService from '../services/User';
import userValidationSchema from './DTO/userSchemas';

const BAD_REQUEST_MESSAGE = 'Invalid username or password';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';

export default class UserController {
  constructor(private userService: UserService) { }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { success } = userValidationSchema.safeParse(req.body);

      if (!success) {
        return res
          .status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_MESSAGE });
      }

      const { username, password } = req.body as IUser;

      const token = await this.userService.login({ username, password });

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: BAD_REQUEST_MESSAGE });
      }

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { success } = userValidationSchema.safeParse(req.body);

      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_MESSAGE });
      }

      const { username, password } = req.body as IUser;

      const token = await this.userService.create({ username, password });

      if (!token) {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Username already exists' });
      }

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      const tokenPayload = Token.validate(authorization as string) as JwtPayload;

      if (!authorization || !tokenPayload) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const result = await this.userService.getAll(tokenPayload.username);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }

  public async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const { authorization } = req.headers;

      const tokenPayload = Token.validate(authorization as string) as JwtPayload;

      if (!authorization || !tokenPayload) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Expired or invalid token' });
      }

      const result = await this.userService.getUser(tokenPayload.username);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
  }
}
