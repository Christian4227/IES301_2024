import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";
import styles from "../../styles/Colaborador.module.css";

export default function CabecalhoColaborador() {
    const { logout } = useContext(AuthContext);

    const Sair = () => {
        logout();
    };
    return (
        <div className={styles.header_cabecalho_colaborador}>
            <label>
                <Link href="/">Ticket Easy Pro </Link>
            </label>
            <nav>
                <ul className={styles.ul}>
                    <li className={styles.li_colaborador_sair}>
                        <Link href="/" onClick={() => Sair()}>
                            Sair
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
