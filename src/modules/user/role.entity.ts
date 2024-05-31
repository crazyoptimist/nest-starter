import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;
}

// We treat roles as schema
export enum RoleEnum {
  Admin = 'admin',
  User = 'user',
}
