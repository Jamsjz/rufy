import "dotenv/config";
import { prisma } from './src/lib/prisma';
async function main() {
  const user = await prisma.user.create({
    data: {
      username: 'test_user2',
      passwordHash: 'dummy'
    }
  });
  console.log('Created User:', user);
}
main().catch(console.error);
