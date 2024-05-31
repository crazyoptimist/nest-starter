import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  AbilityClass,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { User } from '@app/modules/user/user.entity';
import { RoleEnum } from '@app/modules/user/role.entity';

type Subjects = InferSubjects<typeof User | User> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const userRoles = user.roles.map((item) => item.name);

    // Build it precisely :)
    if (userRoles.includes(RoleEnum.Admin)) {
      can(Action.Manage, 'all');
    }

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
