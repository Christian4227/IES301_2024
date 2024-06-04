import React from "react";
import CabecalhoAdmin from "./CabecalhoAdmin";
import MenuAdmin from "./MenuAdmin";
import styles from "@styles/Administracao.module.css";

export default function Administracao() {
    return (
        <div>
            <CabecalhoAdmin />
            <div>
                <div id="div-principal">
                    <div className={styles.header_administrador}>
                        <h1>Administrador</h1>
                    </div>
                </div>
            </div>
            <MenuAdmin />
        </div>
    );
}
