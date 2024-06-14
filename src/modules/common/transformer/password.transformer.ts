import { ValueTransformer } from 'typeorm';
import { Hash } from '../../../utils/hash.util';

export class PasswordTransformer implements ValueTransformer {
  // Hash password when saving to database
  to(value: string) {
    return Hash.make(value);
  }

  // Get hashed password as is
  from(value: string) {
    return value;
  }
}
