// import React, { useState } from "react";
import React from "react";
import CabecalhoOrganizador from "../CabecalhoOrganizador";
import CabecalhoInfoOrganizador from "../CabecalhoInfoOrganizador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import "bootstrap/dist/css/bootstrap.min.css";
// import styles from "@styles/Organizador.module.css";

export default function LocalEventoOrganizador() {
  return (
    <div>
      <CabecalhoOrganizador />
      <CabecalhoInfoOrganizador secao="Local do evento" />
      <SuporteTecnico />
      <div className="div_principal">
        {/* <div className="div_container_principal">
          <div className="div_subtitulo">
            <h2>Formulário do local do evento</h2>
          </div>
          <div>
            <div className="mb-3">
              <label htmlFor="InputNomeEvento" className="form-label">
                Logradouro
              </label>
              <input
                type="text"
                className="form-control"
                id="InputNomeEvento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <label htmlFor="InputNomeEvento" className="form-label">
              Número
            </label>
            <input
              type="text"
              className="form-control"
              id="InputNomeEvento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Estado</label>
            <select
              className="form-select"
              onChange={(e) => setTipoEvento(e.target.value)}
            >
              <option value="">Selecione o status do evento...</option>
              <option value="PLANNED">Planejado</option>
              <option value="IN_PROGRESS">Em progresso</option>
              <option value="COMPLETED">Realizado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div className={styles.secao_filtro_pais}>
            <div className={styles.secao_filtro_pais_tipo}>
              <label>Nacional</label>
              <input
                type="radio"
                name="localidade"
                className="form-check-input"
                value="nacional"
                checked={national}
                onChange={handleNationalChange}
              />
            </div>

            <div className={styles.secao_filtro_pais_tipo}>
              <label>Internacional</label>
              <input
                type="radio"
                name="localidade"
                className="form-check-input"
                value="internacional"
                checked={!national}
                onChange={handleNationalChange}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
