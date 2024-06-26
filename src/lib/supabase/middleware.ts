import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/auth/confirm"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(`${request.nextUrl.origin}/sign-in`));
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("deletion_date")
      .eq("id", user.id)
      .single();
    if (profile?.deletion_date) {
      return request.nextUrl.pathname === "/reactivate"
        ? response
        : NextResponse.redirect(
            new URL(`${request.nextUrl.origin}/reactivate`)
          );
    }
    if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(`${request.nextUrl.origin}/`));
    }
  }

  return response;
}
