import * as bcrypt from 'bcrypt';

export class Hash {
  static make(plainText: string) {
    // Per bcrypt implementation, only the first 72 **bytes** of a string are used. Any extra bytes are ignored when matching passwords.
    if (plainText === '' || plainText.length > 72) {
      throw new Error('Password can not be empty or longer than 72');
    }

    const salt = bcrypt.genSaltSync();

    return bcrypt.hashSync(plainText, salt);
  }

  static compare(plainText: string, hash: string) {
    if (plainText.length === 0) {
      throw new Error('Password can not be empty');
    }
    if (hash.length === 0) {
      throw new Error('Hash can not be empty');
    }

    return bcrypt.compareSync(plainText, hash);
  }
}
