import React, { useEffect, useRef, useState } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Cliente.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import QRCode from "qrcode";
import client from "@/utils/client_axios";
import { useRouter } from "next/router";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { parseCookies } from "nookies";
import { getFullAddress } from "@/utils";
import Image from "next/image";
import eventos from "../../../assets/Evento desconhecido.png";

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

export default function ComprarIngressoCliente() {
  const canvasRef = useRef(null);
  const router = useRouter();
  const idCompra = router.query.idCompra;

  const [message, setMessage] = useState({ text: "", type: "" });
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [dados, setDados] = useState([]);
  // const [ordemCompra, setOrdemCompra] = useState([]);
  const GerarQRCode = () => {
    QRCode.toCanvas(canvasRef.current, idCompra, { width: 250 }, (error) => {
      if (error) {
        console.error("Erro ao gerar o QR Code.", error);
      } else {
        // Capture the image as a Data URL
        // const dataUrl = canvasRef.current.toDataURL();
      }
    });
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const ValidarCompraIngresso = async () => {
    try {
      let data = JSON.stringify({
        paymentMethod: tipoPagamento,
      });
      const response = await client.post(
        `webhook/${idCompra}/payment-confirm`,
        data,
        {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        }
      );
      if (response.status == 201) {
        handleSetMessage("Pagamento realizado com sucesso!", "success");
        setTimeout(() => {
          router.replace("./IngressosCliente");
        }, 6000);
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar as categorias", "error");
      console.log("Erro na requisição de categorias:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = parseCookies();
        let token;
        let valorToken;
        if (cookies && cookies["ticket-token"]) {
          token = cookies["ticket-token"]; // Assumindo que o nome do cookie é 'ticket-token'
          valorToken = JSON.parse(token);
        }
        const response = await client.get(`orders/${idCompra}`, {
          headers: { Authorization: `Bearer ${valorToken?.accessToken}` },
        });

        if (response.status == 200) {
          handleSetMessage("Dados gerados com sucesso!", "success");
          setDados(response.data);
        }
      } catch (error) {
        handleSetMessage("Erro ao carregar os dados", "error");
        console.log("Erro na requisição " + error);
      }
    };
    if (idCompra) {
      fetchData();
    } else {
      router.back();
    }
  }, [idCompra]);

  useEffect(() => {
    const allBasicFieldsValid = tipoPagamento !== "";
    const isFormCurrentlyValid = allBasicFieldsValid;

    setIsFormValid(isFormCurrentlyValid);
  }, [tipoPagamento]);
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Pagamento" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className={styles.div_principal_secao}>
          <div className={styles.div_secao_pagamento_esquerda}>
            <div>
              <div className={styles.titulo_secao}>
                <h1>Informações da compra</h1>
              </div>
              <div className={styles.div_secao_pagamento_esquerda_ingressos}>
                <div className={styles.corpo_secao_info_ingresso}>
                  <div className={styles.corpo_secao_info_ingresso_financeiras}>
                    <div className={styles.div_info_financeiras_subtotal}>
                      <div className={styles.div_info_financeiras_titulo}>
                        <h3>Informações do tipo de ingresso</h3>
                      </div>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Preço base:</label>
                        <span>
                          {dados?.event == undefined
                            ? ""
                            : dados.event.base_price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                        </span>
                      </div>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Ingresso comum:</label>
                        <span>1x R$ 00,00</span>
                      </div>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Meia entrada - estudantes:</label>
                        <span>1x R$ 00,00</span>
                      </div>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Ingresso VIP:</label>
                        <span>1x R$ 00,00</span>
                      </div>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Meia entrada para idosos:</label>
                        <span>1x R$ 00,00</span>
                      </div>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Especial:</label>
                        <span>1x R$ 00,00</span>
                      </div>
                    </div>
                    <div className={styles.div_info_financeiras_total}>
                      <div className={styles.div_info_financeiras_tipos}>
                        <label>Total a pagar:</label>
                        <b>
                          <span>R$ 00,00</span>
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.div_info_evento_compras_cliente}>
              <div className={styles.titulo_secao}>
                <h1>Informações do evento</h1>
              </div>
              <div className="div_container_principal">
                <div
                  className={styles.div_info_evento_compras_info_evento_form}
                >
                  <div className={styles.div_info_evento_compras_div}>
                    <div className={styles.div_info_evento_compras_info_evento}>
                      <label>Nome do evento:</label>
                      <br />
                      <span>
                        {dados?.event == undefined
                          ? ""
                          : getFullAddress(dados?.event.location)}
                      </span>
                    </div>
                    <div className={styles.div_info_evento_compras_info_evento}>
                      <label>Tipo do evento:</label>
                      <br />
                      <span>
                        {dados?.event == undefined
                          ? ""
                          : getFullAddress(dados?.event.location)}
                      </span>
                    </div>
                    <div className={styles.div_info_evento_compras_info_evento}>
                      <label>Local do evento:</label>
                      <br />
                      <span>
                        {dados?.event == undefined
                          ? ""
                          : getFullAddress(dados?.event.location)}
                      </span>
                    </div>
                    <div className={styles.div_info_evento_compras_info_evento}>
                      <label>Data de início:</label>
                      <br />
                      <span>
                        {dados.event == undefined
                          ? ""
                          : new Date(
                              dados.event.initial_date
                            ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.div_info_evento_compras_info_evento}>
                      <label>Data de término:</label>
                      <br />
                      <span>
                        {dados.event == undefined
                          ? ""
                          : new Date(
                              dados.event.final_date
                            ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.div_img_evento_compras_div}>
                    <div className={styles.div_img_evento_compras}>
                      <Image
                        src={
                          dados?.event?.img_thumbnail == undefined
                            ? eventos
                            : dados?.event?.img_thumbnail
                        }
                        width={200}
                        height={200}
                        alt=""
                        className={styles.img_evento_compras}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.div_secao_evento_info_adicional}>
              <div className={styles.titulo_secao}>
                <h2>Recomendações importantes para o evento</h2>
              </div>
              <div className={styles.div_secao_evento_info_texto}>
                <p>
                  <b>Link das instruções dos convidados:</b>{" "}
                  https://ticketeasypro
                </p>
                <p>
                  <b>Segurança:</b> mantenha os seus pertences seja aparelhos
                  eletrônicos ou objetos guardados de maneira segura e sempre a
                  frente ao seu corpo.
                </p>
                <p>
                  <b>
                    *** Em caso de perda do ingresso, será possível o reenvio do
                    mesmo sem custo por e-amil, mas a taxa de uma nova impressão
                    custará R$ 20,00.
                  </b>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.div_secao_pagamento_direita}>
            <div className={styles.div_secao_pagamento_qrcode}>
              <canvas
                ref={canvasRef}
                className={styles.div_secao_pagamento_qrcode_img}
              ></canvas>
              <input
                type="button"
                value="Gerar QR Code de pagamento"
                onClick={() => GerarQRCode()}
                className="botao_sistema"
              />
              <hr />
              <div className="mb-3">
                <label>Método de pagamento</label>
                <select
                  id="TxtTipoEvento"
                  className="form-select"
                  onChange={(e) => setTipoPagamento(e.target.value)}
                >
                  <option value="">Selecione o tipo de pagamento...</option>
                  <option value="CREDIT_CARD">Cartão de crédito</option>
                  <option value="DEBIT_CARD">Cartão de débito</option>
                  <option value="BANK_SLIP">Dinheiro</option>
                  <option value="PIX">Pix</option>
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="button"
                  className="botao_sistema"
                  value="Realizar pagamento agora"
                  onClick={() => ValidarCompraIngresso()}
                  disabled={!isFormValid}
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
