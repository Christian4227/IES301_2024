import React from "react";
import Cabecalho from "./Cabecalho";
import Menu from "./Menu";
import styles from "../styles/Home.module.css";

export default function InfoTipoEvento() {
    return (
        <div id="div-principal">
            <Cabecalho />
            <div id="div-principal"></div>
            <Menu id="menu-lateral" className={styles.menu_lateral} />
        </div>
    );
}
