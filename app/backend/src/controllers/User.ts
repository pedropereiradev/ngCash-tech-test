import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUserLogin } from '../interfaces/IUser';
import UserService from '../services/User';
import loginValidationSchema from './DTO/login';

export default class UserController {
  constructor(private userService: UserService) { }
  
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { success } = loginValidationSchema.safeParse(req.body);

      if (!success) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid username or password'})
      }
        
      const { username, password } = req.body as IUserLogin ;

      const token = await this.userService.login({ username, password })
      
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid username or password' });
      }

      return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}