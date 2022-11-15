import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../interfaces/IUser';
import UserService from '../services/User';
import userValidationSchema from './DTO/userSchemas';

export default class UserController {
  constructor(private userService: UserService) { }
  
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { success } = userValidationSchema.safeParse(req.body);

      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid username or password'})
      }
        
      const { username, password } = req.body as IUser ;

      const token = await this.userService.login({ username, password })
      
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid username or password' });
      }

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { success } = userValidationSchema.safeParse(req.body);

      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid username or password' })
      }

      const { username, password } = req.body as IUser;

      const token = await this.userService.create({ username, password });

      if (!token) {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Username already exists' });
      }

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }
}