import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { Pool } from 'pg';

import { PrismaClient } from '../../../generated/prisma/client.js';

import { plans } from './data/plans.data.js';

dotenv.config();

const pool = new Pool({ connectionString: process.env.POSTGRES_URI });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log('Seeding database with initial data...');
    await prisma.plan.deleteMany();
    await prisma.plan.createMany({
      data: plans,
    });
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw new Error('Seeding failed');
  }
}
main();
