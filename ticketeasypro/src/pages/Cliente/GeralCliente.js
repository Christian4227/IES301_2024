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

function getToken() {
  const cookies = parseCookies();
  let token;
  let valorToken;
  if (cookies && cookies["ticket-token"]) {
    token = cookies["ticket-token"]; // Assumindo que o nome do cookie é 'ticket-token'
    valorToken = JSON.parse(token);
  }
  return valorToken;
}

export default function GeralCliente() {
  const [evento, setEvento] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  // Renderizar os eventos no calendário
  const handleSetCalendario = (dados) => {
    var objeto;
    const array = [];

    var id_objeto = 1;
    for (var i = 0; i < dados.length; i++) {
      objeto = new Object();
      objeto.id = id_objeto;
      objeto.title = dados[i].event.name;
      objeto.start = dados[i].event.initial_date;
      objeto.end = dados[i].event.final_date;
      objeto.backgroundColor = dados[i].event.color.toUpperCase();
      id_objeto++;

      array.push(objeto);
    }

    setEvento(array);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.get(`orders/?order-status=COMPLETED`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        // setEventos(response.data.data);
        handleSetCalendario(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar as categorias", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Home cliente" />
      <SuporteTecnico />
      <div className={styles.div_principal_cliente}>
        <div className={styles.div_esquerda_cliente}>
          <div className={styles.div_opcao_cliente}>
            <Link href="/InfoEventos">
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
            <div className="div_subtitulo">
              <h2>Calendário</h2>
            </div>

            <FullCalendar
              events={evento}
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
