import { BadRequest } from '../errors';

export class ValidatorModule {
  public cpfValidator(cpf: string): boolean {
    const cpfRegex = /^[0-9]{11}$/; // cpf format
    if (cpf.length === 0 || !cpfRegex.test(cpf)) {
      throw new BadRequest('CPF invalid');
    }
    return true;
  }

  public passwordValidator(password: string): boolean {
    const passwordRegex = /^[A-Za-z\d@$!%*?&]{8,15}$/; // 8 to 15 characters, no special characters
    if (!passwordRegex.test(password)) {
      throw new BadRequest(
        'Password must have between 8 and 15 characters and no special characters',
      );
    }
    return true;
  }

  public nameValidator(name: string): boolean {
    const nameRegex = /^[A-Za-z\s]{3,60}$/; // 3 to 60 characters, spaces allowed
    if (name.includes(' ') || !nameRegex.test(name)) {
      throw new BadRequest('Name must have between 3 and 60 characters');
    }
    return true;
  }

  public emailValidator(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // email format
    if (email.length === 0 || !emailRegex.test(email)) {
      throw new BadRequest('Email invalid');
    }
    return true;
  }

  public birthdateValidator(birthdate: string): boolean {
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/; // birthdate format
    if (birthdate.length === 0 || !birthdateRegex.test(birthdate)) {
      throw new BadRequest('Birthdate invalid');
    }
    return true;
  }

  public valueValidator(value: number): boolean {
    if (value <= 0) {
      throw new BadRequest('Value must be greater than 0');
    }
    return true;
  }
}
