import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('Seeding...');

  const account1 = await prisma.account.create({
    data: {
      email: 'lisa@simpson.com',
      firstName: 'Lisa',
      lastName: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    }
  });
  const account2 = await prisma.account.create({
    data: {
      email: 'bart@simpson.com',
      firstName: 'Bart',
      lastName: 'Simpson',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    }
  });
  const organization = await prisma.organization.create({
    data: {
      id: 'simpsons',
      name: 'Simpsons',
      address: 'Springfield, USA',
      defaultTimeZone: 'GMT+0',
      users: {
        create: [
          { account: { connect: { id: account1.id } } },
          { account: { connect: { id: account2.id } } }
        ]
      }
    }
  });
  console.log({ organization, account1, account2 });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect();
  });
