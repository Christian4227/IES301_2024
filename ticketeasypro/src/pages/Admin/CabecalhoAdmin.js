import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";
import styles from "@styles/Cabecalho.module.css";

export default function CabecalhoAdmin() {
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
                    <li className={styles.li_admin_sair}>
                        <a href="#" onClick={() => Sair()}>
                            Sair
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
