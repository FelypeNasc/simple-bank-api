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
        errors.push('Origin Account Number must be between 1 and 99999');
      }
      if (
        originAccount.accountCheckDigit < 1 ||
        originAccount.accountCheckDigit > 9
      ) {
        errors.push('Origin Account Check Digit must be between 1 and 9');
      }
      if (originAccount.agencyNumber < 1 || originAccount.agencyNumber > 9999) {
        errors.push('Origin Account Agency Number must be between 1 and 9999');
      }
      if (
        originAccount.agencyCheckDigit < 1 ||
        originAccount.agencyCheckDigit > 9
      ) {
        errors.push(
          'Origin Account Agency Check Digit must be between 1 and 9',
        );
      }
      if (destinationAccount.cpf.toString().length === 0) {
        errors.push('Destination Account CPF invalid');
      }
      if (
        destinationAccount.accountNumber < 1 ||
        destinationAccount.accountNumber > 99999
      ) {
        errors.push('Destination Account Number must be between 1 and 99999');
      }
      if (
        destinationAccount.accountCheckDigit < 1 ||
        destinationAccount.accountCheckDigit > 9
      ) {
        errors.push('Destination Account Check Digit must be between 1 and 9');
      }
      if (
        destinationAccount.agencyNumber < 1 ||
        destinationAccount.agencyNumber > 9999
      ) {
        errors.push(
          'Destination Account Agency Number must be between 1 and 9999',
        );
      }
      if (
        destinationAccount.agencyCheckDigit < 1 ||
        destinationAccount.agencyCheckDigit > 9
      ) {
        errors.push(
          'Destination Account Agency Check Digit must be between 1 and 9',
        );
      }
      if (errors.length > 0) {
        throw errors;
      }
    } catch (error) {
      throw error;
    }
  }
}
