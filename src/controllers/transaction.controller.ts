import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { ResponseStandard } from '../interfaces/response.interface';

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
      const response: ResponseStandard = {
        status: error.status,
        message: error.message,
      };
      res.status(error.statusCode).send(response);
    }
  }
}
