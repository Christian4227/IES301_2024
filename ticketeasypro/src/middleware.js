import { jwtDecode } from "jwt-decode";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const meuCookie = request.cookies.get("ticket-token");
    if (!meuCookie) {
        return Response.redirect(new URL("/", request.url));
    }
    // Supondo que 'token' é o seu JWT
    const token = JSON.parse(meuCookie.value).accessToken;
    const decoded = jwtDecode(token);
    // // O papel do usuário geralmente é armazenado em uma propriedade do payload do token
    const userRole = decoded.role;
    console.log(`O papel do usuário é: ${userRole}`);
    if (
        userRole === "cliente" &&
        !request.nextUrl.pathname.startsWith("/Cliente")
    ) {
        return Response.redirect(new URL("/Cliente/GeralCliente", request.url));
    }
    if (
        userRole === "admin" &&
        !request.nextUrl.pathname.startsWith("/Admin")
    ) {
        return Response.redirect(new URL("/Admin/Administracao", request.url));
    }
    if (
        userRole === "colaborador" &&
        !request.nextUrl.pathname.startsWith("/Colaborador")
    ) {
        return Response.redirect(
            new URL("/Colaborador/ListaEventos", request.url)
        );
    }
    if (
        userRole === "organizador" &&
        !request.nextUrl.pathname.startsWith("/Organizador")
    ) {
        return Response.redirect(new URL("/Organizador/Dados", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/Colaborador/:path*",
        "/Admin/:path*",
        "/Cliente/:path*",
        "/Organizador/:path*",
    ],
};
