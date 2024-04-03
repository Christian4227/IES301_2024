import Link from "next/link";
import React from "react";
import styles from "../styles/Cabecalho.module.css";
import menu from "../assets/menu lateral.png";
import Image from "next/image";

export default function Cabecalho() {
    const MenuLateral = () => {
        document.getElementById("menu-lateral").style.width = "250px";
        document.getElementById("menu-lateral").style.padding = "10px";
    };

    return (
        <div className={styles.Header}>
            <Link href="./">
                <label>Ticket Easy Pro</label>
            </Link>
            <nav>
                <ul className={styles.ul}>
                    <li>
                        <button onClick={() => MenuLateral()}>
                            <Image
                                src={menu}
                                alt="menu"
                                className={styles.menulateral}
                            />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
