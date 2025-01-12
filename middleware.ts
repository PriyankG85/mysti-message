import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (
    token &&
    (url.pathname.startsWith("/signIn") ||
      url.pathname.startsWith("/signUp") ||
      url.pathname === "/" ||
      url.pathname.startsWith("/verify"))
  )
    return Response.redirect(new URL("/dashboard", url.origin));

  if (!token && url.pathname.startsWith("/dashboard"))
    return Response.redirect(new URL("/signIn", url.origin));
}

export const config = {
  matcher: ["/signIn", "/signUp", "/", "/dashboard/:path*", "/verify/:path*"],
};
