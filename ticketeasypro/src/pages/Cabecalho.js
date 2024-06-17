import Link from "next/link";
import React, { useContext } from "react";
import styles from "@styles/Cabecalho.module.css";
import { AuthContext } from "@/context/Auth";

export default function Cabecalho() {
  const { auth, logout, user, DirecionarRota } = useContext(AuthContext);
  const Sair = () => {
    logout();
  };
  const DirecionarRotaUsuario = () => {
    DirecionarRota(user.role);
  };
  return (
    <div className={styles.Header}>
      <div>
        <Link href="/">
          <label>Event Mais Você</label>
        </Link>
      </div>
      <div className={styles.Header_direita}>
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
                  <Link href="/">Meus dados</Link>{" "}
                  <a href="#" onClick={() => DirecionarRotaUsuario()}>
                    Minha área
                  </a>{" "}
                  <a
                    href="#"
                    className={styles.Header_menu_usuario_opcoes_sair}
                    onClick={() => Sair()}
                  >
                    Sair
                  </a>
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
