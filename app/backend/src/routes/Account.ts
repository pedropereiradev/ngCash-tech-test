import { Router } from 'express';
import AccountController from '../controllers/Account';
import Accounts from '../database/models/Accounts';
import Users from '../database/models/Users';
import AccountService from '../services/Account';


const router = Router();

const accountService = new AccountService(Accounts, Users);
const accountController = new AccountController(accountService);

router.get('/balance', (req, res) => accountController.getBalance(req, res));

export default router;