import { Request } from 'express';

export interface IUser {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface IRequest extends Request {
  user: IUser;
}
