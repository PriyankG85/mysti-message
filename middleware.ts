import { auth } from "@/auth";

export default auth((req) => {
  const url = req.nextUrl;

  if (
    req.auth &&
    (url.pathname.startsWith("/signIn") ||
      url.pathname.startsWith("/signUp") ||
      url.pathname === "/" ||
      url.pathname.startsWith("/verify"))
  )
    return Response.redirect(new URL("/dashboard", url.origin));

  if (!req.auth && url.pathname.startsWith("/dashboard"))
    return Response.redirect(new URL("/signIn", url.origin));
});

export const config = {
  matcher: ["/signIn", "/signUp", "/", "/dashboard/:path*", "/verify/:path*"],
};
