// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode';

const protectedRoutes = ['/', '/upload', '/users', '/companies', '/groupCompanies', '/companyConfig', '/balanco'];
const publicRoutes = ['/auth/login'];

// Verify if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;
    return isExpired;
  } catch (error) {
    return true; // consider expired
  }
}

// Function to refresh token
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// middleware
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  // if the route is protected
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // verify if token is expired
    const tokenExpired = isTokenExpired(token);

    // if is expired but have refreshToken, call the refreshToken api
    if (tokenExpired && refreshToken) {

      const newToken = await refreshAccessToken(refreshToken);
      
      if (newToken) {

        const response = NextResponse.next();
        response.cookies.set('token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000 * 6 //6h
        });
        return response;
      }
    }

    // if token expired and no refresh token
    if (tokenExpired) {
      console.log('Token expired and could not refresh, redirecting to login');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('error', 'Sessão expirada');
      const response = NextResponse.redirect(loginUrl);
      
      response.cookies.delete('token');
      response.cookies.delete('refreshToken');
      
      return response;
    }
  }

  // redirect to public routes
  if (token && !isTokenExpired(token) && isPublicRoute) {

    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};