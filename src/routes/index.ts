import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { TransactionController } from '../controllers/transaction.controller';

export const router = Router();
const accountController = new AccountController();
const transactionController = new TransactionController();

router
  .route('/create-account')
  .post(accountController.createAccount.bind(accountController));
router
  .route('/get-account')
  .post(accountController.getAccount.bind(accountController));
router
  .route('/statement')
  .post(accountController.getStatement.bind(accountController));
router
  .route('/deposit')
  .post(transactionController.makeDeposit.bind(transactionController));
router
  .route('/withdraw')
  .post(transactionController.makeWithdraw.bind(transactionController));
router
  .route('/transfer')
  .post(transactionController.makeTransfer.bind(transactionController));
