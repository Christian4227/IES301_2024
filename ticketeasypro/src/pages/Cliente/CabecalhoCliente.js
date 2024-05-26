import React, { useContext } from "react";
import styles from "../../styles/Cliente.module.css";
import Link from "next/link";
import { AuthContext } from "../../context/Auth";

export default function CabecalhoCliente() {
    const { logout } = useContext(AuthContext);

    const Sair = () => {
        logout();
    };
    return (
        <div className={styles.Header}>
            <Link href="/">
                <label>Ticket Easy Pro</label>
            </Link>
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
