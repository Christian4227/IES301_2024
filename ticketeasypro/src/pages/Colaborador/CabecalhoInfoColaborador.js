import React from "react";
import Link from "next/link";
import styles from "@styles/Colaborador.module.css";
import { useRouter } from "next/router";

export default function CabecalhoInfoColaborador() {
    const router = useRouter();
    const Voltar = () => {
        router.back();
    };
    return (
        <div className={styles.header_colaborador}>
            <h1>Colaborador</h1>
            <nav className={styles.header_colaborador_nav}>
                <ul className={styles.header_colaborador_menu}>
                    <li>
                        <Link href="/Colaborador/IndexColaborador">Home</Link>
                    </li>
                    <li>
                        <Link href="/Colaborador/Dados/DadosColaborador">
                            Meus dados
                        </Link>
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
