import bcrypt from 'bcrypt';
const saltRounds = 10; // Number of rounds to generate the salt

export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
export async function comparePasswords(plainPassword: string, hashedPassword: string) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}
