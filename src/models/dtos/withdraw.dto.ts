export interface WithdrawDto {
  id?: any;
  cpf: number;
  password: string;
  agencyNumber: number;
  accountNumber: number;
  agencyCheckDigit: number;
  accountCheckDigit: number;
  value: number;
}
