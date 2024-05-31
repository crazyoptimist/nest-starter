import dataSource from '../data-source';
import { User } from '../modules/user/user.entity';
import { Role, RoleEnum } from '../modules/user/role.entity';

(async function () {
  await dataSource.initialize();
  await seedAdmin();
  dataSource.destroy();
})();

async function seedAdmin() {
  if (process.argv.length < 4) {
    console.log('Please provide email and password');
    return;
  }

  const adminRole = await dataSource.getRepository(Role).findOne({
    where: {
      name: RoleEnum.Admin,
    },
  });

  const adminUser = dataSource.getRepository(User).create({
    firstName: 'SuperAdmin',
    lastName: 'Manager',
    email: process.argv[2],
    password: process.argv[3],
    roles: [adminRole],
  });

  await dataSource
    .getRepository(User)
    .save(adminUser)
    .then((result) => console.log(result))
    .catch((err) => console.error(err));
}
