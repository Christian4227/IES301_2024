import { jwtDecode } from "jwt-decode";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const meuCookie = request.cookies.get("ticket-token");
    if (!meuCookie) {
        if (request.nextUrl.pathname.startsWith("/Login")) {
            return;
        }
        return Response.redirect(new URL("/", request.url));
    }

    if (meuCookie === undefined) {
        return;
    }

    // Supondo que 'token' é o seu JWT
    const token = JSON.parse(meuCookie.value).accessToken;
    const decoded = jwtDecode(token);
    // O papel do usuário geralmente é armazenado em uma propriedade do payload do token
    const userRole = decoded.role;

    if (
        userRole === "SPECTATOR" &&
        (!request.nextUrl.pathname.startsWith("/Cliente") ||
            request.nextUrl.pathname.startsWith("/Login"))
    ) {
        return Response.redirect(new URL("/Cliente/GeralCliente", request.url));
    }
    if (
        userRole === "ADMIN" &&
        (!request.nextUrl.pathname.startsWith("/Admin") ||
            request.nextUrl.pathname.startsWith("/Login"))
    ) {
        return Response.redirect(new URL("/Admin/Administracao", request.url));
    }
    if (
        userRole === "STAFF" &&
        (!request.nextUrl.pathname.startsWith("/Colaborador") ||
            request.nextUrl.pathname.startsWith("/Login"))
    ) {
        return Response.redirect(
            new URL("/Colaborador/IndexColaborador", request.url)
        );
    }
    if (
        userRole === "EVENT_MANAGER" &&
        (!request.nextUrl.pathname.startsWith("/Organizador") ||
            request.nextUrl.pathname.startsWith("/Login"))
    ) {
        return Response.redirect(new URL("/Organizador/Dados", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/Login/:path*",
        "/Colaborador/:path*",
        "/Admin/:path*",
        "/Cliente/:path*",
        "/Organizador/:path*",
    ],
};
