import React from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/Home.module.css";
import Menu from "./Menu";

export default function InfoEventos() {
    return (
        <div id="div-principal">
            <Cabecalho className={styles.header} />
            <div id="div-principal"></div>
            <Menu id="menu-lateral" className={styles.menu_lateral} />
        </div>
    );
}
