import { Router } from 'express';
import Transactions from '../database/models/Transactions';
import Accounts from '../database/models/Accounts';
import Users from '../database/models/Users';
import TransactionsService from '../services/Transaction';
import TransactionController from '../controllers/Transaction';

const router = Router();

const transactionService = new TransactionsService(Transactions, Users, Accounts);
const transactionController = new TransactionController(transactionService);

router.post('/', (req, res) => transactionController.create(req, res));

export default router;