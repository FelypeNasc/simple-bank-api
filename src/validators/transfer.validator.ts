import { ValidatorModule } from './validator.module';
import { TransferDto } from '../models/dtos/transfer.dto';

export class StatementValidator extends ValidatorModule {
  public validate(transferDto: TransferDto): void {
    try {
      const errors: string[] = [];
      const { originAccount, destinationAccount } = transferDto;
      if (transferDto.value <= 0) {
        errors.push('Value must be greater than 0');
      }
      if (originAccount.cpf.toString().length === 0) {
        errors.push('Origin Account CPF invalid');
      }
      if (
        originAccount.accountNumber < 1 ||
        originAccount.accountNumber > 99999
      ) {
        errors.push('Invalid origin account number');
      }
      if (
        originAccount.accountCheckDigit < 1 ||
        originAccount.accountCheckDigit > 9
      ) {
        errors.push('Invalid origin account check digit');
      }
      if (originAccount.agencyNumber < 1 || originAccount.agencyNumber > 9999) {
        errors.push('Invalid origin agency number');
      }
      if (
        originAccount.agencyCheckDigit < 1 ||
        originAccount.agencyCheckDigit > 9
      ) {
        errors.push('Invalid origin agency check digit');
      }
      if (destinationAccount.cpf.toString().length === 0) {
        errors.push('Destination Account CPF invalid');
      }
      if (
        destinationAccount.accountNumber < 1 ||
        destinationAccount.accountNumber > 99999
      ) {
        errors.push('Invalid destination account number');
      }
      if (
        destinationAccount.accountCheckDigit < 1 ||
        destinationAccount.accountCheckDigit > 9
      ) {
        errors.push('Invalid destination account check digit');
      }
      if (
        destinationAccount.agencyNumber < 1 ||
        destinationAccount.agencyNumber > 9999
      ) {
        errors.push('Invalid destination agency number');
      }
      if (
        destinationAccount.agencyCheckDigit < 1 ||
        destinationAccount.agencyCheckDigit > 9
      ) {
        errors.push('Invalid destination agency check digit');
      }
      if (errors.length > 0) {
        throw errors;
      }
    } catch (error) {
      throw error;
    }
  }
}
