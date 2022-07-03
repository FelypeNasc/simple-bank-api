export default interface AccountResponseModel {
  id: string;
  userId: string;
  password?: string;
  agencyNumber: number;
  agencyCheckDigit: number;
  accountNumber: number;
  accountCheckDigit: number;
  balance: number;
  createdAt?: Date;
}
