// import { NextResponse, NextRequest } from 'next/server';
// import { decodeJwtPayload, hasPermission, Role } from './lib/utils';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const isAuthPath = pathname.startsWith('/auth/');
//   const accessToken = request.cookies.get('access_token')?.value;

//   if (!accessToken) {
//     if (isAuthPath) return NextResponse.next();
//     return NextResponse.redirect(new URL('/auth/sign-in', request.url));
//   }

//   const decoded_token = decodeJwtPayload(accessToken);
//   const now = Math.floor(Date.now() / 1000);
//   const userRole = Number(decoded_token.roleId ?? 2);

//   if (isAuthPath) {
//     let redirectUrl = '/dashboard';
//     if (userRole === 2) {
//       redirectUrl = '/dashboard/articles';
//     } else if (userRole === 1) {
//       redirectUrl = '/dashboard/stats';
//     }
//     return NextResponse.redirect(new URL(redirectUrl, request.url));
//   }

//   if (
//     !decoded_token ||
//     (typeof decoded_token.exp === 'number' && decoded_token.exp <= now)
//   ) {
//     // Expired or bad token: clear cookies & redirect to sign-in
//     const res = NextResponse.redirect(new URL('/auth/sign-in', request.url));
//     res.cookies.delete('access_token');
//     res.cookies.delete('refresh_token');
//     return res;
//   }

//   // Permission gate
//   if (!hasPermission(pathname, userRole as Role)) {
//     return NextResponse.redirect(new URL('/404', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico|images|manifest.webmanifest|sitemap.xml|robots.txt|sitemap.js|robots.js|not-found.js).*)'
//   ]
// };
