import jwt from "jsonwebtoken";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const meuCookie = request.cookies.get("ticket-token");
    // Supondo que 'token' é o seu JWT
    const token = JSON.parse(meuCookie.value).accessToken;

    // 'secret' é a chave secreta usada para assinar o JWT
    const secret = "sua-chave-secreta";

    // Decodificar o token
    const decoded = jwt.verify(token, secret);

    // O papel do usuário geralmente é armazenado em uma propriedade do payload do token
    const userRole = decoded.role;

    console.log(`O papel do usuário é: ${userRole}`);

    const currentUser = request.cookies.get("currentUser")?.value;

    if (currentUser && !request.nextUrl.pathname.startsWith("/Cliente")) {
        return Response.redirect(new URL("/", request.url));
    }

    if (!currentUser && !request.nextUrl.pathname.startsWith("/Admin")) {
        return Response.redirect(
            new URL("/Admin/TelaInicialAdmin", request.url)
        );
    }

    if (
        !currentUser &&
        !request.nextUrl.pathname.startsWith("/pages/Colaborador")
    ) {
        return Response.redirect(new URL("/", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/Colaborador/:path*", "/Admin/:path*", "/Cliente/:path*"],
};
