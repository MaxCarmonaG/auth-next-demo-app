'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFormState } from 'react-dom';
import { auth } from '@/actions/authAction';
import { FormError } from '@/types';

interface AuthFormProps {
  mode: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [formState, formAction] = useFormState<FormError, FormData>(
    auth.bind(null, mode),
    {
      email: '',
      password: '',
    },
  );

  const hasError = Object.values(formState).some((val) => val);

  return (
    <form id="auth-form" action={formAction}>
      <div className="auth-icon">
        <Image
          src="/images/auth-icon.jpg"
          alt="A lock icon"
          fill
          priority
          sizes="10vw"
        />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {hasError && (
        <ul>
          {Object.entries(formState).map(
            ([key, value]) => !!value && <li key={key}>{value}</li>,
          )}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' && (
          <Link href="/?mode=signUp">Create an account.</Link>
        )}
        {mode === 'signUp' && (
          <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}
