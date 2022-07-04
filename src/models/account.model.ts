export default interface AccountModel {
  id?: string;
  userId?: string;
  password?: string;
  agencyNumber: number;
  agencyCheckDigit: number;
  accountNumber: number;
  accountCheckDigit: number;
  balance?: number;
  createdAt?: Date;
}
