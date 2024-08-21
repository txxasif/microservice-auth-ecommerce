import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, boolean } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { compare, hash } from 'bcryptjs';

const SALT_ROUND = 10;

// Define the table schema
export const authTable = sqliteTable('auths', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  profilePublicId: text('profile_public_id').notNull(),
  email: text('email').notNull().unique(),
  country: text('country').notNull(),
  profilePicture: text('profile_picture').notNull(),
  emailVerificationToken: text('email_verification_token').unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  browserName: text('browser_name').notNull(),
  deviceType: text('device_type').notNull(),
  otp: text('otp'),
  otpExpiration: integer('otp_expiration', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: integer('password_reset_expires', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

// Create a database connection
const sqlite = new Database('your_database.db');
const db = drizzle(sqlite);

// Helper functions for password hashing and comparison
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUND);
}

// Function to create a new auth record
export async function createAuth(
  authData: Omit<typeof authTable.$inferInsert, 'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'>
) {
  const hashedPassword = await hashPassword(authData.password);

  return db
    .insert(authTable)
    .values({
      ...authData,
      password: hashedPassword
    })
    .returning();
}

// Function to find an auth record by email
export async function findAuthByEmail(email: string) {
  return db
    .select()
    .from(authTable)
    .where(sql`${authTable.email} = ${email}`)
    .limit(1);
}

// Function to update password
export async function updatePassword(id: number, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  return db
    .update(authTable)
    .set({ password: hashedPassword })
    .where(sql`${authTable.id} = ${id}`);
}

// Example of how you might use these functions
async function example() {
  const newAuth = await createAuth({
    username: 'exampleUser',
    password: 'password123',
    profilePublicId: 'abc123',
    email: 'user@example.com',
    country: 'USA',
    profilePicture: 'http://example.com/pic.jpg',
    browserName: 'Chrome',
    deviceType: 'Desktop'
  });

  console.log('New auth created:', newAuth);

  const foundAuth = await findAuthByEmail('user@example.com');
  if (foundAuth.length > 0) {
    const isPasswordCorrect = await comparePassword('password123', foundAuth[0].password);
    console.log('Password correct:', isPasswordCorrect);
  }
}

example().catch(console.error);
