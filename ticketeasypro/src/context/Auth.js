import React, { createContext, useEffect, useState } from "react";
import client from "@/utils/client_axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = parseCookies();
        const valorCookie = token["ticket-token"];

        if (valorCookie != undefined) {
            setAuth(true);
        } else {
            setAuth(false);
        }
    }, []);

    const ConverterToken = (token) => {
        setCookie(undefined, "ticket-token", JSON.stringify(token));
    };

    const DirecionarRota = (token) => {
        const decoded = jwtDecode(token.accessToken);
        setUser(decoded);

        // // O papel do usuário geralmente é armazenado em uma propriedade do payload do token
        const userRole = decoded.role;

        if (userRole === "ADMIN") {
            router.push("/Admin/Administracao");
        } else if (userRole === "SPECTATOR") {
            router.push("/Cliente/GeralCliente");
        } else if (userRole === "EVENT_MANAGER") {
            router.push("/Organizador/DadosOrganizador");
        } else if (userRole === "STAFF") {
            router.push("/Colaborador/indexColaborador");
        }
    };

    const login = (data) => {
        client
            .post("users/login", data)
            .then((response) => {
                const accessToken = response.data;
                ConverterToken(accessToken);
                DirecionarRota(accessToken);
                setAuth(true);
                setUser(data);
            })
            .catch((error) => {
                console.log("Erro na requisição. " + error);
            });
    };

    const logout = () => {
        destroyCookie(undefined, "ticket-token");
        router.push("/");
        return;
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
