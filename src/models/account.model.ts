export default interface AccountModel {
  id?: string;
  userId?: string;
  password?: string;
  cpf?: number;
  agencyNumber: number;
  agencyCheckDigit: number;
  accountNumber: number;
  accountCheckDigit: number;
  balance?: number;
  createdAt?: Date;
}
