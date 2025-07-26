import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/dashboard', '/my-applications', '/apply'];
const publicRoutes = ['/login', '/signup', '/', '/status'];
const adminRoutes = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => path === route);
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    try {
      const cookie = cookies().get('session')?.value;
      const session = await decrypt(cookie);

      // Redirect to login if no session
      if (!session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
      }

      // Refresh session if it expires within 2 hours
      const expiresAt = new Date(session.expires);
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      if (expiresAt < twoHoursFromNow) {
        const { createSession } = await import('@/lib/session');
        await createSession(session.userId, session.role);
      }

      // Redirect non-admins away from admin routes
      if (isAdminRoute && session.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/my-applications', req.nextUrl));
      }
    } catch (error) {
      // If session verification fails, redirect to login
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
