import { Router } from 'express';
import Accounts from '../database/models/Accounts';
import UserController from '../controllers/User';
import Users from '../database/models/Users';
import UserService from '../services/User';

const router = Router();

const userService = new UserService(Users, Accounts);
const userController = new UserController(userService);

router.post('/login', (req, res) => userController.login(req, res));

export default router;
