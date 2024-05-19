import React from "react";
import styles from "../../styles/Colaborador.module.css";
import Link from "next/link";

export default function DadosColaborador() {
    return (
        <div>
            <div className={styles.header_colaborador}>
                <h1>Colaborador</h1>
                <nav className={styles.header_colaborador_nav}>
                    <ul className={styles.header_colaborador_menu}>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/Colaborador/indexColaborador">
                                Home colaborador
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
