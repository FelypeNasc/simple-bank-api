import { ValidatorModule } from './validator.module';
import { NewAccountDto } from '../models/dtos/new-account.dto';

export class newAccountValidator extends ValidatorModule {
  public validate(newAccountDto: NewAccountDto): void {
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
