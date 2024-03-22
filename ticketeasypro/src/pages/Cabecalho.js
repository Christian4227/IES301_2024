import Link from "next/link";
import React from "react";
import styles from "../styles/Cabecalho.module.css";

export default function Cabecalho() {
    return (
        <header className={styles.Header}>
            <h1>Ticket Easy Pro</h1>
            <nav>
                <ul className={styles.ul}>
                    <Link href="./LoginAdm">
                        <li className={styles.li_Adm}>Área restrita</li>
                    </Link>
                    <Link href="./LoginCliente">
                        <li className={styles.li_Login}>Log in</li>
                    </Link>
                </ul>
            </nav>
        </header>
    );
}
