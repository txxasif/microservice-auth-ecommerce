import { mysqlTable, varchar, boolean, date, timestamp, uniqueIndex, int } from 'drizzle-orm/mysql-core';

export const auths = mysqlTable(
  'auths',
  {
    id: int('id').autoincrement().primaryKey(),
    username: varchar('username', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    profilePublicId: varchar('profilePublicId', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    profilePicture: varchar('profilePicture', { length: 255 }).notNull(),
    emailVerificationToken: varchar('emailVerificationToken', { length: 255 }).notNull(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    browserName: varchar('browserName', { length: 255 }).notNull(),
    deviceType: varchar('deviceType', { length: 255 }).notNull(),
    otp: varchar('otp', { length: 255 }),
    otpExpiration: date('otpExpiration'),
    createdAt: timestamp('createdAt').defaultNow(),
    passwordResetToken: varchar('passwordResetToken', { length: 255 }),
    passwordResetExpires: timestamp('passwordResetExpires')
  },
  (table) => {
    return {
      idIndex: uniqueIndex('idIndex').on(table.id),
      emailIndex: uniqueIndex('emailIndex').on(table.email),
      userNameIndex: uniqueIndex('userNameIndex').on(table.username),
      emailVerificationTokenIndex: uniqueIndex('emailVerificationTokenIndex').on(table.emailVerificationToken)
    };
  }
);
