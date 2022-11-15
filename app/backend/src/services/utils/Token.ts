import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ng_Cash';

const JWT_OPTIONS = { expiresIn: '24h' };

export default class Token {
  public static generate(email: string) {
    return jwt.sign(email, JWT_SECRET, JWT_OPTIONS)
  }
}