/* eslint-disable @typescript-eslint/no-use-before-define */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

if (require.main === module) {
  main()
    .then(console.log)
    .catch(e => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });
}

async function main() {
  dotenv.config();
  console.log('Seeding...');

  const organization = {
    id: 'simpsons',
    name: 'Simpsons',
    address: 'Springfield, USA',
    defaultTimeZone: 'GMT+0'
  };
  const accounts = [
    {
      id: 'lisa',
      email: 'lisa@simpson.com',
      firstName: 'Lisa',
      lastName: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    },
    {
      id: 'bart',
      email: 'bart@simpson.com',
      firstName: 'Bart',
      lastName: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    }
  ];
  await Promise.all(
    accounts.map(account =>
      prisma.account.upsert({
        where: { email: account.email },
        update: {},
        create: account
      })
    )
  );
  const { users } = await prisma.organization.upsert({
    where: { id: 'simpsons' },
    update: {},
    create: {
      ...organization,
      users: {
        create: accounts.map(account => ({
          account: { connect: { id: account.id } },
          userRoles: {
            create: {
              role: 'ORGANIZATION_ADMIN'
            }
          }
        }))
      }
    },
    include: {
      users: true
    }
  });
  await Promise.all(
    users.map(user =>
      prisma.account.update({
        data: {
          currentUser: {
            connect: {
              id: user.id
            }
          }
        },
        where: {
          id: user.accountId
        }
      })
    )
  );
  return { organization, accounts };
}
