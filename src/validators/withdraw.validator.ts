import { ValidatorModule } from './validator.module';
import { WithdrawDto } from '../models/dtos/withdraw.dto';
import { BadRequest } from '../errors';

export class WithdrawValidator extends ValidatorModule {
  public validate(withdrawDto: WithdrawDto): void {
    if (!withdrawDto.cpf) {
      throw new BadRequest('CPF is required');
    }

    if (!withdrawDto.password) {
      throw new BadRequest('Password is required');
    }

    if (!withdrawDto.value) {
      throw new BadRequest('Value is required');
    }

    if (
      !withdrawDto.agencyNumber ||
      !withdrawDto.accountNumber ||
      !withdrawDto.agencyCheckDigit ||
      !withdrawDto.accountCheckDigit
    ) {
      throw new BadRequest('Account number and agency number is required');
    }

    try {
      this.cpfValidator(withdrawDto.cpf);
      this.valueValidator(withdrawDto.value);
      this.passwordValidator(withdrawDto.password);
      this.accountValidator(
        withdrawDto.accountNumber,
        withdrawDto.accountCheckDigit,
      );
      this.agencyValidator(
        withdrawDto.agencyNumber,
        withdrawDto.agencyCheckDigit,
      );
    } catch (error) {
      throw error;
    }
  }
}
