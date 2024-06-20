import React, { useEffect, useRef } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Cliente.module.css";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import PDFViewer from "@/components/PDFViewer";
import download from "../../../assets/Download - escuro sem fundo.png";

export default function ComprarIngressoCliente() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const ComprarOnline = () => {
    router.push("/");
  };
  const GerarQRCode = () => {
    QRCode.toCanvas(
      canvasRef.current,
      "Testsdklfjfjksdsdfhkjdshfkjdssdhfkjsdsdhfjkdshfksje",
      { width: 250 },
      (error) => {
        if (error) {
          console.error("Erro ao gerar o QR Code.", error);
        } else {
          // Capture the image as a Data URL
          const dataUrl = canvasRef.current.toDataURL();
          // setImage(dataUrl);
          // console.log(image);
        }
      }
    );
  };
  useEffect(() => {}, []);
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
                <h1>Informações do ingresso</h1>
              </div>
              <div className={styles.corpo_secao_info_ingresso}>
                <div className={styles.corpo_info_usuario}>
                  <div>
                    <label>Nome:</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>E-mail:</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>Telefone:</label>
                    <span>-</span>
                  </div>
                  <div>
                    <label>Celular:</label>
                    <span>-</span>
                  </div>
                </div>
                <div className={styles.corpo_secao_info_ingresso_financeiras}>
                  <div className={styles.div_info_financeiras_subtotal}>
                    <div className={styles.div_info_financeiras_titulo}>
                      <h3>Informações do tipo de ingresso</h3>
                    </div>
                    <div className={styles.div_info_financeiras_tipos}>
                      <label>Comum:</label>
                      <span>1x R$ 00,00</span>
                    </div>
                    <div className={styles.div_info_financeiras_tipos}>
                      <label>Estudante:</label>
                      <span>1x R$ 00,00</span>
                    </div>
                    <div className={styles.div_info_financeiras_tipos}>
                      <label>Idoso:</label>
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
            <div className={styles.div_info_evento_compras_cliente}>
              <div className={styles.titulo_secao}>
                <h1>Informações do evento</h1>
              </div>
              <div>
                <div>
                  <label>Local do evento:</label>
                  <span>-</span>
                </div>
                <div>
                  <label>Data de início:</label>
                  <span>-</span>
                </div>
                <div>
                  <label>Data de término:</label>
                  <span>-</span>
                </div>
              </div>
            </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
