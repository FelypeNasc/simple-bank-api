export default interface TransactionModel {
  id?: string;
  origin_account_id?: string;
  destination_account_id: string;
  value: number;
  type: string;
  tax: number;
  total_value: number;
  created_at?: Date;
}
