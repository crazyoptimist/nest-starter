import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ length: 50 })
  name: string;
}

// We treat roles as schema
export enum RoleEnum {
  Admin = 'admin',
  User = 'user',
}
