import React from "react";
import CabecalhoOrganizador from "./CabecalhoOrganizador";
import CabecalhoInfoOrganizador from "./CabecalhoInfoOrganizador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Organizador.module.css";
import Link from "next/link";

export default function GeralOrganizador() {
  return (
    <div>
      <CabecalhoOrganizador />
      <CabecalhoInfoOrganizador secao="Página inicial" />
      <SuporteTecnico role="Organizador" />
      <div className={styles.div_principal_organizador}>
        <div className={styles.div_principal_home_eventos}>
          <div className={styles.div_home_eventos}>
            <Link href="./Eventos/GeralEventosOrganizador">
              <div className={styles.div_home_eventos_texto}>
                <h1>Eventos</h1>
              </div>
              <div className={styles.div_home_eventos_texto}>
                <p>
                  Veja e edite as informações dos eventos. É possível visualizar
                  no mapa as localidades.
                </p>
              </div>
            </Link>
          </div>
          <div className={styles.div_home_colaborador}>
            <Link href="./Cadastrar/CadastrarColaborador">
              <div className={styles.div_home_eventos_texto}>
                <h1>Colaborador</h1>
              </div>
              <div className={styles.div_home_eventos_texto}>
                <p>
                  Cadastre os colaboradores para te ajudar na venda e validação
                  de ingressos aos seus clientes.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
