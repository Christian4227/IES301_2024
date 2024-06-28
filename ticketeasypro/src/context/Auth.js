import React, { createContext, useEffect, useState } from "react";
import client from "@/utils/client_axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [retorno, setRetorno] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = parseCookies();
    const valorCookie = token["ticket-token"];

    if (valorCookie != undefined) {
      setAuth(true);
      const decoded = jwtDecode(valorCookie);
      setUser(decoded);
    } else {
      setAuth(false);
    }
  }, []);

  const ConverterToken = (token) => {
    const cookieConfig = {
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
      secure: true,
    };
    setCookie(null, "ticket-token", JSON.stringify(token), cookieConfig);
    localStorage.setItem("ticket-token", JSON.stringify(token));
  };

  const DirecionarRota = (userRole) => {
    if (userRole === "ADMIN") {
      router.push("/Admin/Administracao");
    } else if (userRole === "SPECTATOR") {
      router.push("/Cliente/GeralCliente");
    } else if (userRole === "EVENT_MANAGER") {
      router.push("/Organizador/GeralOrganizador");
    } else if (userRole === "STAFF") {
      router.push("/Colaborador/IndexColaborador");
    }
  };

  const DirecionarRotaPerfil = (userRole) => {
    if (userRole === "ADMIN") {
      router.push("/Admin/Dados/DadosAdministrador");
    } else if (userRole === "SPECTATOR") {
      router.push("/Cliente/Dados/DadosCliente");
    } else if (userRole === "EVENT_MANAGER") {
      router.push("/Organizador/Dados/DadosOrganizador");
    } else if (userRole === "STAFF") {
      router.push("/Colaborador/Dados/DadosColaborador");
    }
  };

  const login = (data, idEvento) => {
    client
      .post("users/login", data)
      .then((response) => {
        setAuth(true);
        setRetorno(response.status);
        const accessToken = response.data;
        ConverterToken(accessToken);
        setUser(data);

        const decoded = jwtDecode(accessToken.accessToken);
        setUser(decoded);

        // // O papel do usuário geralmente é armazenado em uma propriedade do payload do token
        const userRole = decoded.role;
        if (idEvento != null) {
          router.push(
            `/Cliente/EventosCliente/EventoEscolhido?eventId=${idEvento}`
          );
        } else {
          DirecionarRota(userRole);
        }
      })
      .catch((error) => {
        console.log("Erro na requisição. " + error);
        setRetorno(error.response?.status);
        setAuth(false);
      });
  };

  const logout = () => {
    destroyCookie(null, "ticket-token", { path: "/" });
    localStorage.removeItem("ticket-token");
    setAuth(false);
    router.push(router.asPath);
  };

  const logoutPrivado = () => {
    destroyCookie(null, "ticket-token", { path: "/" });
    localStorage.removeItem("ticket-token");
    setAuth(false);
    router.push("/");
  };

  const setPoliticaCookies = () => {
    const cookieConfig = {
      sameSite: "Strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30 * 12,
      secure: true,
    };
    setCookie(undefined, "ticket-politica", true, cookieConfig);
    localStorage.setItem("ticket-politica", true);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        login,
        logout,
        logoutPrivado,
        DirecionarRota,
        DirecionarRotaPerfil,
        retorno,
        setPoliticaCookies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
