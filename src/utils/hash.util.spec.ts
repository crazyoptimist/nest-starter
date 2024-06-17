import { Hash } from './hash.util';

describe('Hash.make', () => {
  test('panics if a password longer than 72 is given', () => {
    const tooLongPassword =
      "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*(),.:;'-+_abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890";

    expect(() => Hash.make(tooLongPassword)).toThrow();
  });

  test('panics if an empty password is given', () => {
    expect(() => Hash.make('')).toThrow();
  });
});

describe('Hash.compare', () => {
  test('panics if password or hash is an empty string', () => {
    const anyHash = Hash.make('any string');
    expect(() => Hash.compare('', anyHash)).toThrow();
    expect(() => Hash.compare('any string', '')).toThrow();
  });
});
