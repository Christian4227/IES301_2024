import React, { useEffect, useState } from "react";
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
import client from "@/utils/client_axios";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { parseCookies } from "nookies";

export default function GeralCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  useEffect(() => {
    const token = parseCookies();
    var valorToken = token["ticket-token"];
    valorToken = JSON.parse(valorToken).accessToken;

    client
      .get("/orders/", {
        headers: {
          Authorization: `Bearer ${valorToken}`,
        },
      })
      .then((response) => {
        setPedidos(response.data.data);
      })
      .catch((error) => {
        handleSetMessage("Erro ao carregar os dados.", "error");
        console.log("Erro na requisição " + error);
      });
  }, []);
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Home cliente" />
      <SuporteTecnico />
      <div className={styles.div_principal_cliente}>
        <div className={styles.div_esquerda_cliente}>
          <div className={styles.div_opcao_cliente}>
            {/* <Link href="./EventosCliente/EventosGeraisCliente"> */}
            <Link href="./EventosCliente/EventoEscolhido">
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
            <label>Calendário</label>
            <FullCalendar
              events={[
                {
                  id: 1,
                  title: "Evento de teste",
                  start: "2024-06-15",
                  end: "2024-06-18",
                },
              ]}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
            />
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
