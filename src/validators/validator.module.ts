import { BadRequest } from '../errors';

export class ValidatorModule {
  public cpfValidator(cpf: number): boolean {
    const cpfRegex = /^[0-9]{11}$/; // cpf format
    if (cpf.toString().length === 0 || !cpfRegex.test(cpf.toString())) {
      throw new BadRequest('CPF invalid');
    }
    return true;
  }

  public passwordValidator(password: string): boolean {
    const passwordRegex = /^[0-9]{4,8}$/; // 4 to 8 characters, just numbers
    if (!passwordRegex.test(password)) {
      throw new BadRequest(
        'Password must be numeric and have between 4 and 8 characters',
      );
    }
    return true;
  }

  public checkPasswordValidator(password: string): boolean {
    if (password.length === 0) {
      throw new BadRequest('Password is required');
    }
    return true;
  }

  public nameValidator(name: string): boolean {
    const nameRegex = /^[A-Za-z\s]{3,60}$/; // 3 to 60 characters, spaces allowed
    if (
      name.includes('  ') ||
      name.split(' ').length < 2 ||
      !nameRegex.test(name)
    ) {
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

  public accountValidator(accountNumber: number, checkDigit: number): boolean {
    if (1 > accountNumber || accountNumber > 99999) {
      throw new BadRequest('Invalid account number');
    }
    if (1 > checkDigit || checkDigit > 9) {
      throw new BadRequest('Invalid account check digit');
    }
    return true;
  }

  public agencyValidator(agencyNumber: number, checkDigit: number): boolean {
    if (1 > agencyNumber || agencyNumber > 999) {
      throw new BadRequest('Invalid agency number');
    }
    if (1 > checkDigit || checkDigit > 9) {
      throw new BadRequest('Invalid agency check digit');
    }
    return true;
  }
}
