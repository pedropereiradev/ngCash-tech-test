import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ng_Cash';

const JWT_OPTIONS = { expiresIn: '1d' };

export default class Token {
  public static generate(username: string) {
    return jwt.sign({ username }, JWT_SECRET, JWT_OPTIONS);
  }

  public static validate(token: string) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);

      return payload;
    } catch (err) {
      return null;
    }

  }
}