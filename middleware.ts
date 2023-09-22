import type { RequestContext } from '@vercel/edge';
import { next } from '@vercel/edge';
import { RequestCookies } from '@edge-runtime/cookies'
import Discord from './utils/discord.js';

export const config = {
  matcher: '/api/:path*'
};

const exludedPaths = [
  '/api/user/login',
  '/api/user/logout',
];

export default async function middleware(request: Request, _context: RequestContext) {
  const requestUrl = new URL(request.url);
  const headers = new Headers(request.headers);
  const cookies = new RequestCookies(request.headers);

  if (exludedPaths.includes(requestUrl.pathname)) {
    return next({ headers, request });
  }

  if (!cookies.has('refresh_token')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const refreshToken = cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { access_token, refresh_token, expires_in } = await Discord.getTokenFromRefreshToken(refreshToken)

  headers.set('Set-Cookie', `refresh_token=${refresh_token}; path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires_in};`);

  headers.append('X-Token', `access_token=${access_token}`);

  return next({ headers, request });
}
