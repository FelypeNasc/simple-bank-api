import { ResponseStandard } from '../models/response.interface';

export class InternalError extends Error implements ResponseStandard {
  public message: string;
  public status: 'success' | 'error' | 'fail';
  public statusCode: number;

  constructor() {
    super('An internal error has occurred, please try again later');
    this.message = 'An internal error has occurred, please try again later';
    this.status = 'error';
    this.statusCode = 500;
  }
}

export class BadRequest extends Error implements ResponseStandard {
  public message: string;
  public status: 'success' | 'error' | 'fail';
  public statusCode: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.status = 'fail';
    this.statusCode = 400;
  }
}
