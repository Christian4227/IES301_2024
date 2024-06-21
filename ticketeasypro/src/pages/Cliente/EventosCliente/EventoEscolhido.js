import React, { useCallback, useEffect, useState } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import client from "@/utils/client_axios";
import { useRouter } from "next/router";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import styles from "@styles/Cliente.module.css";
import Image from "next/image";
import disney from "../../../assets/disney_World.jpg";
import { parseCookies } from "nookies";

export default function EventoEscolhido() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [message, setMessage] = useState({ text: "", type: "" });
  const [evento, setEvento] = useState([]);

  const handleSetMessage = useCallback((message, type) => {
    setMessage({ text: message, type });
  }, []);

  const DirecionarFormulario = () => {
    router.push("./EventoEscolhidoForm");
  };

  useEffect(() => {
    const token = parseCookies();
    var valorToken = token["ticket-token"];
    valorToken = JSON.parse(valorToken).accessToken;

    if (!eventId) {
      handleSetMessage("Evento escolhido não encontrado.", "error");
      setTimeout(() => {
        router.back();
      }, 6000);
    }

    client
      .get(`/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${valorToken}`,
        },
      })
      .then((response) => {
        setEvento(response.data.data);
        if (evento.length == 0) {
          handleSetMessage("Não foi encontrado o evento procurado", "error");
        }
      })
      .catch((error) => {
        handleSetMessage("Erro ao carregar os dados.", "error");
        console.log("Erro na requisição " + error);
      });
  }, []);

  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Evento escolhido" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className="div_container_principal">
          <div>
            <h1>Nome do evento</h1>
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "black",
              }}
            ></div>
          </div>
          <div className={styles.div_corpo_evento_escolhido}>
            <div className={styles.div_img_evento_escolhido}>
              <Image
                src={disney}
                alt="disney"
                className={styles.img_evento_escolhido}
              />
            </div>
            <div className={styles.div_evento_escolhido_info}>
              <div className={styles.div_evento_escolhido_descricao}>
                <div className={styles.div_evento_escolhido_descricao_titulo}>
                  <label>Descrição</label>
                </div>
                <p>-</p>
              </div>
              <div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Local</label>
                  <span>-</span>
                </div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Data início</label>
                  <span>-</span>
                </div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Data término</label>
                  <span>-</span>
                </div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Preço base</label>
                  <span>-</span>
                </div>
              </div>
              <div className={styles.div_botao_reservar_evento_escolhido}>
                <input
                  type="button"
                  value="Comprar"
                  className="botao_sistema"
                  onClick={() => DirecionarFormulario()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
