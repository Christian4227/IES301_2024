import React from "react";
import styles from "@styles/CabecalhoMenu.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

// eslint-disable-next-line react/prop-types
export default function CabecalhoHomeMenu({ componente }) {
    const router = useRouter();
    const Voltar = () => {
        router.back();
    };
    return (
        <div className={styles.header_home}>
            <h1>{componente}</h1>
            <nav className={styles.header_home_nav}>
                <ul className={styles.header_home_menu}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/InfoEventos">Eventos</Link>
                    </li>
                    <li>
                        <Link href="/CadastroCliente">Cadastrar</Link>
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
