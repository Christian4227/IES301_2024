import React from "react";
import styles from "../../styles/Cliente.module.css";
import Link from "next/link";

export default function CabecalhoCliente() {
    return (
        <div className={styles.Header}>
            <Link href="/">
                <label>Ticket Easy Pro</label>
            </Link>
            <nav>
                <ul className={styles.ul}>
                    <Link href="/">
                        <li className={styles.li_Login}>Sair</li>
                    </Link>
                </ul>
            </nav>
        </div>
    );
}
