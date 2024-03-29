import Link from "next/link";
import React from "react";
import styles from "../styles/Cabecalho.module.css";

export default function Cabecalho() {
    return (
        <div className={styles.Header}>
            <Link href="./">
                <label>Ticket Easy Pro</label>
            </Link>
            <nav>
                <ul className={styles.ul}>
                    <Link href="./LoginAdm">
                        <li className={styles.li_Adm}>Área restrita</li>
                    </Link>
                    <Link href="./LoginCliente">
                        <li className={styles.li_Login}>Entrar</li>
                    </Link>
                </ul>
            </nav>
        </div>
    );
}
