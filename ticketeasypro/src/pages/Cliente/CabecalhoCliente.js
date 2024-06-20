import React, { useContext } from "react";
import styles from "@styles/Cliente.module.css";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";

export default function CabecalhoCliente() {
  const { auth, logout, user } = useContext(AuthContext);

  const Sair = () => {
    logout();
  };
  return (
    <div className={styles.Header}>
      <div>
        <Link href="/">
          <label>Ticket Easy Pro</label>
        </Link>
      </div>
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
                    <label>{user.role == "SPECTATOR" ? "Cliente" : ""}</label>
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
    </div>
  );
}
