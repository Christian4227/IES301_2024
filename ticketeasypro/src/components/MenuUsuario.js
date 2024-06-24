import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";
import styles from "@styles/Componentes.module.css";

export default function MenuUsuario() {
  const { auth, logoutPrivado, user } = useContext(AuthContext);

  const Sair = () => {
    logoutPrivado();
  };
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
                        : user.role == "MANAGER"
                          ? "Gerente"
                          : user.role == "ADMINISTRATOR"
                            ? "Administrador"
                            : ""}
                  </label>
                </div>
                <div className={styles.Header_menu_usuario_opcoes_submenus}>
                  <Link href="./DadosCliente">Meus dados</Link>{" "}
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
