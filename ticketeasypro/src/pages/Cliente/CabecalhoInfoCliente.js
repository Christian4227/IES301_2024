import React from "react";
import Link from "next/link";
import styles from "../../styles/Cliente.module.css";
import { useRouter } from "next/router";

export default function CabecalhoInfoCliente() {
    const router = useRouter();
    const Voltar = () => {
        router.back();
    };
    return (
        <div className={styles.header_cliente}>
            <h1>Cliente</h1>
            <nav className={styles.header_cliente_nav}>
                <ul className={styles.header_cliente_menu}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/Cliente/GeralCliente">Home cliente</Link>
                    </li>
                    <li>
                        <Link href="/Cliente/Dadoscliente">Meus dados</Link>
                    </li>
                    <li>
                        <a href="#" onClick={Voltar}>
                            Voltar
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
