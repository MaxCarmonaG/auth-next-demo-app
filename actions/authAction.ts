'use server';

import { createAuthSession, destroySession } from '@/lib/auth';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';
import { FormError } from '@/types';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export const signUp = async (formError: FormError, formData: FormData) => {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  let hasError = false;

  if (!email?.includes('@')) {
    formError.email = 'Please enter a valid email address';
    hasError = true;
  } else {
    formError.email = '';
  }

  if (password && password.trim().length < 8) {
    formError.password = 'Password must be at least 8 characters long.';
    hasError = true;
  } else {
    formError.password = '';
  }

  if (!hasError && email && password) {
    const hashedPassword = hashUserPassword(password);

    try {
      const id = String(createUser(email, hashedPassword));
      await createAuthSession(id);
      redirect('/training');
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        formError.email =
          'It seems like an account for the chosen email already exists.';
      }

      if (isRedirectError(error)) {
        throw error;
      }
    }
  }
  return formError;
};

export const login = async (formError: FormError, formData: FormData) => {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  let hasError = false;

  const existingUSer = getUserByEmail(email || '') ?? {
    id: '',
    email: '',
    password: '',
  };

  if (!existingUSer) {
    formError.email =
      'Could bit authenticate user, please check your credentials.';
    hasError = true;
  } else {
    formError.email = '';
  }

  const isValidPassword = verifyPassword(existingUSer.password, password || '');

  if (!isValidPassword) {
    formError.password = 'Invalid password.';
    hasError = true;
  } else {
    formError.password = '';
  }

  if (!hasError) {
    try {
      await createAuthSession(String(existingUSer.id));
      redirect('/training');
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error;
      }
    }
  }

  return formError;
};

export const auth = async (
  mode: string,
  prevState: FormError,
  formData: FormData,
) => {
  if (mode === 'login') {
    return login(prevState, formData);
  }
  return signUp(prevState, formData);
};

export const logout = async () => {
  await destroySession();
  redirect('/');
};
