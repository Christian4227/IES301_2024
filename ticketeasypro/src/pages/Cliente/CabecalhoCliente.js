import React, { useContext } from "react";
import styles from "../../styles/Cliente.module.css";
import Link from "next/link";
import { AuthContext } from "../../context/Auth";
import { useRouter } from "next/router";

export default function CabecalhoCliente() {
    const { signOut } = useContext(AuthContext);
    const router = useRouter();

    const Sair = () => {
        signOut();
        router.push("/");
    };
    return (
        <div className={styles.Header}>
            <Link href="/">
                <label>Ticket Easy Pro</label>
            </Link>
            <nav>
                <ul className={styles.ul}>
                    <button onClick={() => Sair()}>
                        <li className={styles.li_Login}>Sair</li>
                    </button>
                </ul>
            </nav>
        </div>
    );
}
