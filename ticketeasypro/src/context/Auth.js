import React, { createContext, useEffect, useState } from "react";
import client from "@/utils/client_axios";
import { setCookie } from "nookies";
import { useRouter } from "next/router";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuth(true);
        }
    }, []);

    const ConverterToken = (token) => {
        setCookie(undefined, "ticket-token", JSON.stringify(token));
    }

    const login = (data) => {
        client.post("users/login", data)
            .then((response) => {
                const accessToken = response.data;
                ConverterToken(accessToken);
                router.push("/Admin/Administracao");
            })
            .catch((error) => {
                console.log("Erro na requisição. " + error);
            });

        setUser(data);
    };

    const signOut = () => {
        localStorage.removeItem("token");
        return;
    };

    return (
        <AuthContext.Provider value={{ auth, user, login, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
