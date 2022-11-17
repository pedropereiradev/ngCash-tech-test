import { Router } from 'express';
import Accounts from '../database/models/Accounts';
import UserController from '../controllers/User';
import Users from '../database/models/Users';
import UserService from '../services/User';

const router = Router();

const userService = new UserService(Users, Accounts);
const userController = new UserController(userService);

router.post('/', (req, res) => userController.create(req, res));
router.get('/all', (req, res) => userController.getAll(req, res));
router.get('/', (req, res) => userController.getUser(req, res));

export default router;
