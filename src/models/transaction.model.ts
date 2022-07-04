export default interface TransactionModel {
  id?: string;
  originAccountId?: string;
  destinationAccountId?: string;
  value: number;
  type: string;
  tax: number;
  totalValue: number;
  createdAt?: Date;
}
