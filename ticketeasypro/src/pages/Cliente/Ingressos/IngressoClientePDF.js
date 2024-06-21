import React, { useEffect, useState } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import PDFViewer from "@/components/PDFViewer";
import styles from "@styles/Cliente.module.css";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

export default function IngressoClientePDF() {
  const router = useRouter();
  const idCompra = router.query.idCompra;
  // const [ingressos, setIngressos] = useState([]);
  // const [paginas, setPaginas] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
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
      } catch (error) {
        handleSetMessage("Erro ao carregar os dados", "error");
        console.log("Erro na requisição " + error);
      }
    };
    if (idCompra) {
      fetchData();
    }
  }, [idCompra]);
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Ingresso PDF" />
      <SuporteTecnico />
      <div className={styles.div_principal_pdf}>
        <div className={styles.div_pdf_particao}>
          <PDFViewer file="" />
        </div>
        <div className={styles.div_pdf_info_ingresso}>
          <div className={styles.div_info_financeiras_titulo}>
            <h1>Informações do ingresso</h1>
          </div>
          <div className={styles.corpo_secao_info_ingresso_PDF}>
            <div className={styles.corpo_secao_info_ingresso_PDF_cliente}>
              <div>
                <label>Nome do responsável:</label>
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
              <div>
                <label>E-mail:</label>
                <span>-</span>
              </div>
              <div>
                <label>Qtd. de ingressos comprados:</label>
                <span>-</span>
              </div>
              <div>
                <label>Página</label>
                <select></select>
              </div>
            </div>

            <div className={styles.corpo_secao_info_ingresso_financeiras}>
              <div className={styles.div_info_financeiras_subtotal}>
                <div className={styles.div_info_financeiras_titulo}>
                  <h3>Informações do tipo de ingresso</h3>
                </div>
                <div className={styles.div_info_financeiras_tipos}>
                  <label>Comum:</label>
                  <span>1x</span>
                </div>
                <div className={styles.div_info_financeiras_tipos}>
                  <label>Estudante:</label>
                  <span>1x</span>
                </div>
                <div className={styles.div_info_financeiras_tipos}>
                  <label>Idoso:</label>
                  <span>1x</span>
                </div>
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
