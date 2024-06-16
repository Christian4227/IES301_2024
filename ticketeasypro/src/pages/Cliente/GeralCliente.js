import React from "react";
import CabecalhoCliente from "./CabecalhoCliente";
import CabecalhoInfoCliente from "./CabecalhoInfoCliente";
import Image from "next/image";
import styles from "@styles/Cliente.module.css";
import eventos from "../../assets/eventos.png";
import ingressos from "../../assets/ticket.png";
import Link from "next/link";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function GeralCliente() {
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Home cliente" />
      <SuporteTecnico />
      <div className={styles.div_principal_cliente}>
        <div className={styles.div_esquerda_cliente}>
          <div className={styles.div_opcao_cliente}>
            <Link href="./EventosCliente/EventosGeraisCliente">
              <Image
                src={eventos}
                alt="img_eventos"
                className={styles.img_div_opcao}
              />
            </Link>
            <label>Eventos</label>
          </div>
          <div className={styles.div_opcao_cliente}>
            <Link href="./Ingressos/IngressosCliente">
              <Image
                src={ingressos}
                alt="img_ingressos"
                className={styles.img_div_opcao}
              />
            </Link>
            <label>Ingressos</label>
          </div>
        </div>
        <div className="div_container_principal">
          <div>
            <label>Quadro de avisos</label>
          </div>
          <div>
            <label>Calendário</label>
            <FullCalendar
              events={[
                {
                  id: 1,
                  title: "Evento de teste",
                  start: "2024-06-13",
                  end: "2024-06-14",
                },
              ]}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
