import { DepositDto } from '../models/dtos/deposit.dto';
import { ValidatorModule } from './validator.module';

export class DepositValidator extends ValidatorModule {
  public validate(depositDto: DepositDto): void {
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
