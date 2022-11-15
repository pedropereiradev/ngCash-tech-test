import * as bcrypt from 'bcryptjs';

export default class BCrypt {
  public static compare(encrypted: string, value: string): boolean {
    return bcrypt.compareSync(value, encrypted);
  }
}