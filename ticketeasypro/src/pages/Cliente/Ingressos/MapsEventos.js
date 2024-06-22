import React, { useEffect, useState } from "react";
import styles from "@styles/Cliente.module.css";
import Image from "next/image";
import seta_esquerda from "../../../assets/seta esquerda.png";
import seta_direita from "../../../assets/seta_direita.png";
import eventos from "../../../assets/eventos.png";
import local_evento from "../../../assets/google_maps.png";
import calendario from "../../../assets/Calendário.png";
import multidao from "../../../assets/multidao.png";
import status_evento from "../../../assets/Status_evento.png";
import tipo_evento from "../../../assets/tipo evento.png";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { getStatusStringEvent, getFullAddress } from "@/utils";

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

export default function MapsEventos() {
  const router = useRouter();
  const idEvento = router.query.idEvento;
  const [aberto, setAberto] = useState(false);
  const [evento, setEvento] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const Voltar = () => {
    router.push("./IngressosCliente");
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.get(`events/${idEvento}`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setEvento(response.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar as categorias", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    };
    if (idEvento) {
      fetchCategories();
    }
  }, [idEvento]);
  return (
    <div>
      <div className={styles.map_eventos_cliente}></div>
      <div className={styles.map_eventos_cliente_menu}>
        <div className={styles.map_eventos_cliente_menu_esquerda}>
          <div className={styles.map_eventos_cliente_menu_voltar}>
            <input
              type="button"
              className="botao_sistema"
              value="Voltar"
              onClick={() => Voltar()}
            />
          </div>
          <div className={styles.map_eventos_cliente_menu_esquerda_img}>
            <Image
              src={eventos}
              alt="eventos"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={tipo_evento}
              alt="Tipo evento"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={local_evento}
              alt="local"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={calendario}
              alt="Calendário"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={calendario}
              alt="Calendário"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={multidao}
              alt="Multidão"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={status_evento}
              alt="Status evento"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
          </div>
        </div>
        {aberto ? (
          <>
            <button
              type="button"
              className={styles.botao_menu_lateral_maps_eventos_cliente}
              onClick={() => setAberto(false)}
            >
              <Image
                src={seta_esquerda}
                alt="seta_menu"
                className={styles.img_menu_lateral}
              />
            </button>
            <div className={styles.map_eventos_cliente_menu_direita}>
              <div className={styles.map_eventos_cliente_menu_titulo}>
                <h1>Informações do evento</h1>
              </div>
              <hr />
              <div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Nome do evento</h2>
                  <label>{evento.name}</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Tipo do evento</h2>
                  <label>{evento.category.name}</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Local do evento</h2>
                  <label>{getFullAddress(evento.location)}</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Data início</h2>
                  <label>
                    {new Date(evento.initial_date).toLocaleDateString()}
                  </label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Data final</h2>
                  <label>
                    {new Date(evento.final_date).toLocaleDateString()}
                  </label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Capacidade</h2>
                  <label>{evento.capacity}</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Status do evento</h2>
                  <label>{getStatusStringEvent(evento.status)}</label>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              className={styles.botao_menu_lateral_maps_eventos_cliente}
              onClick={() => setAberto(true)}
            >
              <Image
                src={seta_direita}
                alt="seta_menu"
                className={styles.img_menu_lateral}
              />
            </button>
          </>
        )}
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
