export default interface TransactionResponseModel {
  id?: string;
  originAccountId?: string;
  destinationAccountId: string;
  value: number;
  type: string;
  tax: number;
  totalValue: number;
  createdAt?: Date;
}
