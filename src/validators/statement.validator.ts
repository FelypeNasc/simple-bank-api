import { ValidatorModule } from './validator.module';
import { StatementDto } from '../models/dtos/statement.dto';
import { BadRequest } from '../errors';

export class StatementValidator extends ValidatorModule {
  public validate(statementDto: StatementDto): void {
    if (!statementDto.cpf) {
      throw new BadRequest('CPF is required');
    }

    if (!statementDto.password) {
      throw new BadRequest('Password is required');
    }

    if (
      !statementDto.agencyNumber ||
      !statementDto.accountNumber ||
      !statementDto.agencyCheckDigit ||
      !statementDto.accountCheckDigit
    ) {
      throw new BadRequest('Account number and agency number is required');
    }
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
