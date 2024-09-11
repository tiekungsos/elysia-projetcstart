import { Elysia } from 'elysia';

import UnauthorizedError from '@/domain/exceptions/UnauthorizedError';

export default (app: Elysia) =>
  // @ts-expect-error This remains valid after JWT is implemented.
  app.derive(async ({ jwt, headers, request }) => {
    // TODO: Fix me later.
    if (request.url.includes('/docs')) {
      return;
    }

    const user = await jwt.verify(headers.authorization?.split(' ')[1]);

    console.log('user',user);
    
    if (!user) {
      throw new UnauthorizedError('Invalid token!');
    }

    request.headers.set('user', user)

    // next();
    return {
      user
    };
  });