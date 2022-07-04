import { ValidatorModule } from './validator.module';
import { StatementDto } from '../models/dtos/statement.dto';

export class StatementValidator extends ValidatorModule {
  public validate(statementDto: StatementDto): void {
    try {
      this.cpfValidator(statementDto.cpf);
      this.passwordValidator(statementDto.password);
      this.accountValidator(
        statementDto.accountNumber,
        statementDto.accountCheckDigit,
      );
      this.agencyValidator(
        statementDto.agencyNumber,
        statementDto.agencyCheckDigit,
      );
    } catch (error) {
      throw error;
    }
  }
}
