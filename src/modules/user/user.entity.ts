import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attribute, hashKey, rangeKey } from '@shiftcoders/dynamo-easy';

@Schema()
export class User extends Document {
  @hashKey()
  id: string;

  @Attribute()
  firstName: string;

  @Attribute()
  lastName: string;

  @rangeKey()
  email: string;

  @Attribute()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
