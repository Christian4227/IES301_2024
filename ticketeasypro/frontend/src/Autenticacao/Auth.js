import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false);
    const [desconectando, setDesconectando] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            setAuth(true);
            setDesconectando(false);
        }
    }, []);

    const signIn = (email, senha) => {
        if (email == "Christian" && senha == "123456") {
            return true;
        }

        return false;
    };

    const signOut = () => {
        return true;
    };

    return (
        <AuthContext.Provider value={{ auth, signIn, signOut, desconectando }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
