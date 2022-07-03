export default interface AccountModel {
  id: string;
  user_id?: string;
  password: string;
  agency_number: number;
  agency_check_digit: number;
  account_number: number;
  account_check_digit: number;
  balance: number;
}
