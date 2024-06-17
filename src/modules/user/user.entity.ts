import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { PasswordTransformer } from '../common/transformer/password.transformer';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

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

  @Column({
    name: 'refresh_token',
    nullable: true,
  })
  @Exclude()
  refreshToken: string;

  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Role[];
}
