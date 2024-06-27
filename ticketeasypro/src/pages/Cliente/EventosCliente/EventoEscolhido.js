import React, { useCallback, useEffect, useState } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import client from "@/utils/client_axios";
import { useRouter } from "next/router";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import styles from "@styles/Cliente.module.css";
import Image from "next/image";
import { getFullAddress, getToken } from "@/utils";


export default function EventoEscolhido() {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [message, setMessage] = useState({ text: "", type: "" });
  const [evento, setEvento] = useState([]);
  const [imageData, setImageData] = useState("");

  const handleSetMessage = useCallback((message, type) => {
    setMessage({ text: message, type });
  }, []);

  const direcionarFormulario = () => {
    
    router.push(`./EventoEscolhidoForm?eventId=${eventId}`);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await client.get(`events/${eventId}`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setEvento(response.data);
        setImageData(response.data.img_banner);
      } catch (error) {
        handleSetMessage("Erro ao carregar as categorias", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (!imageData) return <div>Carregando imagem...</div>;

  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Evento escolhido" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className="div_container_principal flex-auto">
          <div>
            <div className={styles.secao_tabela_eventos_titulo}>
              <h2>{evento.name}</h2>
              <label>
                {evento.category == undefined ? "" : evento.category?.name}
              </label>
            </div>
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: evento.color,
              }}
            ></div>
          </div>
          <div className={styles.div_corpo_evento_escolhido}>
            <div className={styles.div_img_evento_escolhido}>
              <Image
                src={imageData}
                alt="img_evento"
                className={styles.img_evento_escolhido}
                width={300}
                height={200}
              />
            </div>
            <div className={styles.div_evento_escolhido_info}>
              <div className={styles.div_evento_escolhido_descricao}>
                <div className={styles.div_evento_escolhido_descricao_titulo}>
                  <label>Descrição</label>
                </div>
                <p>{evento.description}</p>
              </div>
              <div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Local: </label>
                  <span>
                    {evento.location == undefined
                      ? ""
                      : getFullAddress(evento?.location)}
                  </span>
                </div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Data início: </label>
                  <span>
                    {new Date(evento.initial_date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Data término: </label>
                  <span>
                    {new Date(evento.final_date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.div_descricao_info_eventos}>
                  <label>Preço base: </label>
                  <span>
                    {evento.base_price == undefined
                      ? ""
                      : `${(evento.base_price / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", })}`}
                  </span>
                </div>
              </div>
              <div className={styles.div_botao_reservar_evento_escolhido}>
                <input
                  type="button"
                  value="Comprar"
                  className="botao_sistema"
                  onClick={direcionarFormulario}
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