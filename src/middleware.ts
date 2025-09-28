import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./lib/auth";

// Rotas que precisam de autenticação
const protectedRoutes = [
  "/dashboard",
  "/alunos",
  "/treinos",
  "/exercicios",
  "/planos",
  "/perfil",
  "/exercicios",
];
// Rotas de API protegidas, exceto /api/auth/*
const protectedApiRoutes = [
  "/api/exercises",
  "/api/workouts",
  "/api/plans",
  "/api/alunos",
  "/api/admin",
  "/api/dashboard",
];
// Rotas que só podem ser acessadas sem autenticação
const authRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // Permite acesso público ao /api/auth/*
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Se está tentando acessar rota protegida
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verifica se o token é válido
    const adminData = await verifyTokenEdge(token);
    if (!adminData) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Protege rotas de API (exceto /api/auth/*)
  if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const adminData = await verifyTokenEdge(token);
    if (!adminData) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Se está autenticado e tentando acessar login
  if (authRoutes.includes(pathname)) {
    if (token) {
      const adminData = await verifyTokenEdge(token);
      if (adminData) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Redireciona root para dashboard se autenticado, senão para login
  if (pathname === "/") {
    if (token) {
      const adminData = await verifyTokenEdge(token);
      if (adminData) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
