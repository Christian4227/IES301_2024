import React, { useEffect, useState } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Colaborador.module.css";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

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
export default function PagarCompraColaborador() {
  const router = useRouter();
  const idCompra = router.query.idCompra;
  const [compras, setCompras] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState("");

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
          router.replace("./TelaConfirmacaoIngresso");
        }, 6000);
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar as categorias", "error");
      console.log("Erro na requisição de categorias:", error);
    }
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`orders/${idCompra}`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setCompras(response.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar os dados", "error");
        console.log("Erro na requisição " + error);
      }
    };
    if (idCompra) {
      fetchData();
    }
  }, [idCompra]);

  useEffect(() => {
    const allBasicFieldsValid = tipoPagamento !== "";
    const isFormCurrentlyValid = allBasicFieldsValid;

    setIsFormValid(isFormCurrentlyValid);
  }, [tipoPagamento]);
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Dados do ingresso PDF" />
      <SuporteTecnico />
      <div className="div_principal">
        <div className="div_container_principal">
          <div></div>
          <div>
            <div>
              <div className="mb-3">
                <label>Nome completo</label>
                <span>{}</span>
              </div>
              <div className="mb-3">
                <label>E-mail</label>
                <span></span>
              </div>
              <div className="mb-3">
                <label>Telefone</label>
                <span></span>
              </div>
              <div className="mb-3">
                <label>Celular</label>
                <span></span>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <label>Nome do evento</label>
                <span></span>
              </div>
              <div className="mb-3">
                <label>Tipo de evento</label>
                <span></span>
              </div>
              <div className="mb-3">
                <label>Data de início</label>
                <span></span>
              </div>
              <div className="mb-3">
                <label>Data de término</label>
                <span></span>
              </div>
              <div className="mb-3">
                <label>Capacidade</label>
                <span></span>
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

            <div className="mb-3">
              <label>ID Compra</label>
              <br />
              <span>{idCompra}</span>
            </div>
            <div className="mb-3">
              <label>Data da compra</label>
              <br />
              <label>{new Date(compras.created_at).toLocaleDateString()}</label>
            </div>
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => ValidarCompraIngresso()}
              disabled={!isFormValid}
            >
              Validar
            </button>
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
