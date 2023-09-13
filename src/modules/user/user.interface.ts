import { Request } from 'express';

export interface IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  external_identity_id?: string;
}

export interface IRequest extends Request {
  user: IUser;
}
