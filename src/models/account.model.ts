export default interface AccountModel {
  id: string;
  user_id?: string;
  password: string;
  agency_number: number;
  agency_verifier_code: number;
  account_number: number;
  account_verifier_code: number;
  balance: number;
}
