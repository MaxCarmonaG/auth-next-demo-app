import { UserType } from '@/types';
import db from './db';

export const createUser = (email: string, password: string) => {
  const result = db
    .prepare<string[]>('INSERT INTO users (email, password) VALUES (?, ?);')
    .run(email, password);
  return result.lastInsertRowid;
};

export const getUserByEmail = (email: string) => {
  return db
    .prepare<string, UserType>('SELECT * FROM users WHERE email = ?')
    .get(email);
};
