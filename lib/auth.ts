import { cookies } from 'next/headers';
import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import db from './db';

const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions',
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export const createAuthSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const { name, value, attributes } = lucia.createSessionCookie(session.id);
  cookies().set(name, value, attributes);
};

export const verifyAuth = async () => {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  if (!sessionCookie || !sessionCookie.value) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionCookie.value);

  // Refreshing session
  if (result.session && result.session.fresh) {
    const { name, value, attributes } = lucia.createSessionCookie(
      result.session.id,
    );
    cookies().set(name, value, attributes);
  }

  if (!result.session) {
    const { name, value, attributes } = lucia.createBlankSessionCookie();
    cookies().set(name, value, attributes);
  }

  return result;
};

export const destroySession = async () => {
  const { session } = await verifyAuth();

  if (!session) {
    return {
      user: null,
      session: null,
      error: 'Unauthorized!',
    };
  }

  await lucia.invalidateSession(session.id);
  const { name, value, attributes } = lucia.createBlankSessionCookie();
  cookies().set(name, value, attributes);
};
