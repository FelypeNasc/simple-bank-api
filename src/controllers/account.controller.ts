import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';
import { ResponseStandard } from '../models/response.interface';

export class AccountController {
  private accountService = new AccountService();

  public async createAccount(req: Request, res: Response) {
    try {
      const data = await this.accountService.createAccount(req.body);
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

  public async getAccount(req: Request, res: Response) {
    try {
      const data = await this.accountService.getAccount(req.body);
      const response: ResponseStandard = {
        status: 'success',
        data,
      };
      res.status(200).send(response);
    } catch (error: any) {
      console.log(error);
      const response: ResponseStandard = {
        status: error.status,
        message: error.message,
      };
      res.status(error.statusCode).send(response);
    }
  }

  public async getStatement(req: Request, res: Response) {
    try {
      const data = await this.accountService.getStatement(req.body);
      const response: ResponseStandard = {
        status: 'success',
        data,
      };
      res.status(200).send(response);
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
