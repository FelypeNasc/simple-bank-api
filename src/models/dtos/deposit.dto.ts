export interface DepositDto {
  cpf: string;
  agency: number;
  account: number;
  agencyCheckDigit: number;
  accountCheckDigit: number;
  value: number;
}
