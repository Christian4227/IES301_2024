import React from "react";
import styles from "../../styles/Menu.module.css";
import Image from "next/image";
import Link from "next/link";
import fechar from "../../assets/x.png";

export default function MenuAdmin() {
    const FecharMenuLateral = () => {
        document.getElementById("menu-lateral").style.width = 0;
        document.getElementById("menu-lateral").style.padding = 0;
    };
    return (
        <div id="menu-lateral" className={styles.menu_lateral}>
            <nav>
                <div className={styles.menu_lateral_header}>
                    <div className={styles.logo_admin}>
                        <label>C</label>
                    </div>
                    <div>
                        <b>
                            <h1>Administração</h1>
                        </b>
                        <label>Christian Satio Cubo</label>
                    </div>
                    <div>
                        <button onClick={() => FecharMenuLateral()}>
                            <Image
                                src={fechar}
                                alt="fechar"
                                className={styles.img_menu_lateral}
                            />
                        </button>
                    </div>
                </div>
                <hr />
                <div className={styles.menus_usuarios}>
                    <ul>
                        <li>
                            <Link href="/Admin/Cliente">Clientes</Link>
                        </li>
                        <li>
                            <Link href="/Admin/Usuario">
                                Usuários do sistema
                            </Link>
                        </li>
                        <li>
                            <Link href="/Admin/Organizador">Organizadores</Link>
                        </li>
                        <li>
                            <Link href="/Admin/Evento">Eventos</Link>
                        </li>
                        <li>
                            <Link href="/Admin/Tickets">Ingressos</Link>
                        </li>
                        <li>
                            <Link href="/Admin/Pedidos">Pedidos</Link>
                        </li>
                    </ul>
                </div>
                <hr />
                <div className={styles.footer_menu}>
                    <Link href="/">Sair</Link>
                </div>
            </nav>
        </div>
    );
}
