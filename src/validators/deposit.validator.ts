import { DepositDto } from '../models/dtos/deposit.dto';
import { ValidatorModule } from './validator.module';
import { BadRequest } from '../errors';

export class DepositValidator extends ValidatorModule {
  public validate(depositDto: DepositDto): void {
    if (!depositDto.cpf) {
      throw new BadRequest('CPF is required');
    }

    if (!depositDto.value) {
      throw new BadRequest('Value is required');
    }

    if (
      !depositDto.agencyNumber ||
      !depositDto.accountNumber ||
      !depositDto.agencyCheckDigit ||
      !depositDto.accountCheckDigit
    ) {
      throw new BadRequest('Account number and agency number is required');
    }

    try {
      this.cpfValidator(depositDto.cpf);
      this.valueValidator(depositDto.value);
      this.accountValidator(
        depositDto.accountNumber,
        depositDto.accountCheckDigit,
      );
      this.agencyValidator(
        depositDto.agencyNumber,
        depositDto.agencyCheckDigit,
      );
    } catch (error) {
      throw error;
    }
  }
}
