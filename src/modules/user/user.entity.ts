import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { PasswordTransformer } from '../common/transformer/password.transformer';

@Entity({
  name: 'users',
})
export class User {
  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', length: 255 })
  lastName: string;

  @Column({ name: 'email', unique: true, length: 255 })
  email: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password: string;
}
