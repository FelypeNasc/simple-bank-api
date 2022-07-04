import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { ResponseStandard } from '../models/response.interface';

export class TransactionController {
  private transactionService = new TransactionService();

  public async makeDeposit(req: Request, res: Response) {
    try {
      const data = await this.transactionService.makeDeposit(req.body);

      const response: ResponseStandard = {
        status: 'success',
        data,
      };

      res.status(201).send(response);
    } catch (error: any) {
      console.log(error);

      const response: ResponseStandard = {
        status: error.status,
        message: error.message,
      };

      res.status(error.statusCode).send(response);
    }
  }

  public async makeWithdraw(req: Request, res: Response) {
    try {
      const data = await this.transactionService.makeWithdraw(req.body);

      const response: ResponseStandard = {
        status: 'success',
        data,
      };

      res.status(201).send(response);
    } catch (error: any) {
      console.log(error);

      const response: ResponseStandard = {
        status: error.status,
        message: error.message,
      };

      res.status(error.statusCode).send(response);
    }
  }
}
