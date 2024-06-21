import React from "react";
import styles from "@styles/Colaborador.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import CabecalhoColaborador from "../CabecalhoColaborador";

export default function ValidarIngresso() {
  const Validar = () => {
    alert("Ingresso validado.");
  };
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Validar ingresso" />
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
