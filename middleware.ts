export async function middleware(req: any) {
  const url = req.nextUrl;
  const session = req.cookies.get("authjs.session-token");

  if (
    session &&
    (url.pathname.startsWith("/signIn") ||
      url.pathname.startsWith("/signUp") ||
      url.pathname === "/" ||
      url.pathname.startsWith("/verify"))
  )
    return Response.redirect(new URL("/dashboard", url.origin));

  if (!session && url.pathname.startsWith("/dashboard"))
    return Response.redirect(new URL("/signIn", url.origin));
}

export const config = {
  matcher: ["/signIn", "/signUp", "/", "/dashboard/:path*", "/verify/:path*"],
};
