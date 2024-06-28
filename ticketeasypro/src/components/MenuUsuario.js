import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";
import styles from "@styles/Componentes.module.css";
import { getToken } from "@/utils";
import { jwtDecode } from "jwt-decode";

export default function MenuUsuario() {
  const { auth, logoutPrivado, user, DirecionarRotaPerfil } =
    useContext(AuthContext);
  const [papel, setPapel] = useState(null);

  const Sair = () => {
    logoutPrivado();
  };
  useEffect(() => {
    const valor = getToken();
    var role;

    if (valor) {
      role = jwtDecode(getToken().accessToken.toString()).role;
      setPapel(role);
    }
  }, []);
  return (
    <div>
      <nav>
        <ul className={styles.ul}>
          {auth ? (
            <li className={styles.Header_menu_usuario_li_menu}>
              <div className={styles.Header_menu_usuario}>
                <div className={styles.Header_menu_usuario_logo}>
                  {user.name.substring(0, 1)}
                </div>
                <div className={styles.Header_menu_usuario_descricao}>
                  <label>
                    {user.name.split(" ")[0] +
                      " " +
                      user.name.split(" ")[user.name.split(" ").length - 1]}
                  </label>
                </div>
              </div>
              <div className={styles.Header_menu_usuario_opcoes}>
                <div
                  className={styles.Header_menu_usuario_opcoes_titulo_submenu}
                >
                  <label>
                    {user.role == "SPECTATOR"
                      ? "Cliente"
                      : user.role == "STAFF"
                        ? "Colaborador"
                        : user.role == "EVENT_MANAGER"
                          ? "Gerente"
                          : user.role == "ADMIN"
                            ? "Administrador"
                            : ""}
                  </label>
                </div>
                <div className={styles.Header_menu_usuario_opcoes_submenus}>
                  <a href="#" onClick={() => DirecionarRotaPerfil(papel)}>
                    Meus dados
                  </a>{" "}
                  <a
                    href="#"
                    className={styles.Header_menu_usuario_opcoes_sair}
                    onClick={() => Sair()}
                  >
                    Sair
                  </a>
                </div>
              </div>
            </li>
          ) : (
            <li className={styles.Header_menu_usuario_opcoes_entrar}>
              <Link href="/Login">Entrar</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
