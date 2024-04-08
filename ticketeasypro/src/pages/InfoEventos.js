import React from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/Home.module.css";
import stylese from "../styles/InfoEventos.module.css";
import Link from "next/link";
import Menu from "./Menu";

export default function InfoEventos() {
    return (
        <div id="div-principal">
            <Cabecalho className={styles.header} />
            <div id="div-principal">
                <div className={stylese.header_infoEventos}>
                    <h1>Eventos</h1>
                    <nav className={stylese.header_infoEventos_nav}>
                        <ul className={stylese.header_InfoEventos_menu}>
                            <Link href="./InfoTipoEvento">
                                <li>Tipo de evento</li>
                            </Link>
                            <Link href="./">
                                <li>Home</li>
                            </Link>
                        </ul>
                    </nav>
                </div>
            </div>
            <Menu id="menu-lateral" className={styles.menu_lateral} />
        </div>
    );
}
