import { ValidatorModule } from './validator.module';
import { WithdrawDto } from '../models/dtos/withdraw.dto';

export class WithdrawValidator extends ValidatorModule {
  public validate(withdrawDto: WithdrawDto): void {
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
