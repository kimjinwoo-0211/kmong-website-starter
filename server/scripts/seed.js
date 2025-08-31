import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';


dotenv.config();


async function run() {
await connectDB(process.env.MONGO_URI);
const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin1234';


let user = await User.findOne({ username });
if (!user) {
const passwordHash = await bcrypt.hash(password, 10);
user = await User.create({ username, passwordHash, role: 'admin' });
console.log('✅ Admin user created:', username);
} else {
console.log('ℹ️ Admin already exists:', username);
}
process.exit(0);
}


run();