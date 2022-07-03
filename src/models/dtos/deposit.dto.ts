export interface DepositDto {
  id?: any;
  cpf: number;
  agencyNumber: number;
  accountNumber: number;
  agencyCheckDigit: number;
  accountCheckDigit: number;
  value: number;
}
