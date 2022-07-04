export interface TransferDto {
  value: number;
  password: string;
  originAccount: {
    cpf: number;
    agencyNumber: number;
    accountNumber: number;
    agencyCheckDigit: number;
    accountCheckDigit: number;
  };
  destinationAccount: {
    cpf: number;
    agencyNumber: number;
    accountNumber: number;
    agencyCheckDigit: number;
    accountCheckDigit: number;
  };
}
