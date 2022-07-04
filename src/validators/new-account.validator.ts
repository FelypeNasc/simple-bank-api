import { ValidatorModule } from './validator.module';
import { NewAccountDto } from '../models/dtos/new-account.dto';
import { BadRequest } from '../errors';

export class NewAccountValidator extends ValidatorModule {
  public validate(newAccountDto: NewAccountDto): void {
    if (!newAccountDto.name) {
      throw new BadRequest('Name is required');
    }

    if (!newAccountDto.cpf) {
      throw new BadRequest('CPF is required');
    }

    if (!newAccountDto.password) {
      throw new BadRequest('Password is required');
    }

    if (!newAccountDto.email) {
      throw new BadRequest('Email is required');
    }

    if (!newAccountDto.birthdate) {
      throw new BadRequest('Birthdate is required');
    }

    try {
      this.nameValidator(newAccountDto.name);
      this.cpfValidator(newAccountDto.cpf);
      this.emailValidator(newAccountDto.email);
      this.passwordValidator(newAccountDto.password);
      this.birthdateValidator(newAccountDto.birthdate);
    } catch (error) {
      throw error;
    }
  }
}
