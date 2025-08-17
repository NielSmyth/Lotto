import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/dashboard', '/my-applications', '/apply'];
const publicRoutes = ['/login', '/signup', '/', '/status'];
const adminRoutes = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute) {
    if (!session?.userId) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
    if (isAdminRoute && session.role !== 'ADMIN') {
      // If a non-admin tries to access an admin route, redirect them.
      return NextResponse.redirect(new URL('/my-applications', req.nextUrl));
    }
  }

  // Redirect logged-in users from auth pages to their respective dashboards
  if (session?.userId && (path === '/login' || path === '/signup')) {
    if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return NextResponse.redirect(new URL('/my-applications', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
