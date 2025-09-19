import 'dotenv/config';
import { connectToDatabase } from '../src/lib/mongodb.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/utils/encryption.js';

const [nameArg, emailArg, passwordArg] = process.argv.slice(2);

if (!nameArg || !emailArg || !passwordArg) {
  console.error('Usage: node scripts/seed-user.mjs "Full Name" user@example.com password123');
  process.exit(1);
}

async function main() {
  await connectToDatabase();

  const email = emailArg.toLowerCase();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    console.log(`User with email ${email} already exists (id: ${existing._id}).`);
    process.exit(0);
  }

  const hashedPassword = await hashPassword(passwordArg);
  const usernameBase = nameArg.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18) || 'member';
  const username = `${usernameBase}_${Math.random().toString(36).slice(2, 6)}`;

  const user = await User.create({
    name: nameArg,
    email,
    username,
    password: hashedPassword,
    headline: 'New member',
  });

  console.log('User created successfully:');
  console.log(`  id: ${user._id}`);
  console.log(`  email: ${user.email}`);
  console.log(`  username: ${user.username}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed user', error);
    process.exit(1);
  });
