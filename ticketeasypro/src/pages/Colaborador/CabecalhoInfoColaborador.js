import React from "react";
import Link from "next/link";
import styles from "../../styles/Colaborador.module.css";

export default function CabecalhoInfoColaborador() {
    return (
        <div className={styles.header_colaborador}>
            <h1>Colaborador</h1>
            <nav className={styles.header_colaborador_nav}>
                <ul className={styles.header_colaborador_menu}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/Colaborador/DadosColaborador">
                            Meus dados
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
