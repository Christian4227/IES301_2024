import React, { useState } from "react";
import styles from "@styles/Cliente.module.css";
import Image from "next/image";
import seta_esquerda from "../../../assets/seta esquerda.png";
import seta_direita from "../../../assets/seta_direita.png";
import eventos from "../../../assets/eventos.png";
import local_evento from "../../../assets/google_maps.png";
import calendario from "../../../assets/Calendário.png";
import multidao from "../../../assets/multidao.png";
import status_evento from "../../../assets/Status_evento.png";
import status_ticket from "../../../assets/Status_ticket.png";
import { useRouter } from "next/router";

export default function MapsEventos() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const Voltar = () => {
    router.push("./IngressosCliente");
  };
  return (
    <div>
      <div className={styles.map_eventos_cliente}></div>
      <div className={styles.map_eventos_cliente_menu}>
        <div className={styles.map_eventos_cliente_menu_esquerda}>
          <div className={styles.map_eventos_cliente_menu_voltar}>
            <input
              type="button"
              className={styles.botao_maps_cliente_voltar}
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
              src={eventos}
              alt="eventos"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={local_evento}
              alt="eventos"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={calendario}
              alt="eventos"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={multidao}
              alt="eventos"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={status_evento}
              alt="eventos"
              className={styles.img_maps_eventos_cliente_menu_lateral_img}
            />
            <Image
              src={status_ticket}
              alt="eventos"
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
                  <label>-</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Tipo do evento</h2>
                  <label>-</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Local do evento</h2>
                  <label>-</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Data</h2>
                  <label>06/06/2024</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Capacidade</h2>
                  <label>-</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Status do evento</h2>
                  <label>-</label>
                </div>
                <div className={styles.map_eventos_cliente_menu_info}>
                  <h2>Status do ingresso</h2>
                  <label>-</label>
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
    </div>
  );
}
