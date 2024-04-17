import React from "react";
import Link from "next/link";
import Cabecalho from "../Cabecalho";
import styles from "../../styles/Colaborador.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ValidarIngresso() {
    const Validar = () => {
        alert("Ingresso validado.");
    };
    return (
        <div>
            <Cabecalho />
            <div className={styles.header_colaborador}>
                <h1>Colaborador</h1>
                <nav className={styles.header_colaborador_nav}>
                    <ul className={styles.header_colaborador_menu}>
                        <Link href="/Colaborador/ListaEventos">
                            <li>Lista de eventos</li>
                        </Link>
                    </ul>
                </nav>
            </div>
            <div className={styles.body_colaborador}>
                <div className={styles.info_ingressos}>
                    <label>Nº do ingresso</label>
                    <span>---------------</span>
                    <label>Nome da pessoa</label>
                    <span>---------------</span>
                    <label>Evento</label>
                    <span>---------------</span>
                    <label>Data</label>
                    <span>---------------</span>
                    <input
                        id="btnValidador"
                        type="button"
                        value="Validar"
                        className={styles.botao}
                        onClick={() => Validar()}
                    />
                </div>
            </div>
        </div>
    );
}
