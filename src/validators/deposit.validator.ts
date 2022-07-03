import { DepositDto } from '../models/dtos/deposit.dto';
import { ValidatorModule } from './validator.module';

export class DepositValidator extends ValidatorModule {
  public validate(depositDto: DepositDto): void {
    try {
      this.cpfValidator(depositDto.cpf);
      this.valueValidator(depositDto.value);
      // TODO: Add agency and account validators
    } catch (error) {
      throw error;
    }
  }
}
