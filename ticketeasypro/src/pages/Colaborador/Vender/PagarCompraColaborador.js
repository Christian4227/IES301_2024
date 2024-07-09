import React, { useEffect, useState } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Colaborador.module.css";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";
import { GerarPDFIngresso } from "@/utils/GerarPDFIngresso";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [documento, setDocumento] = useState(null);

  const ValidarCompraIngresso = async () => {
    var documentoGerado;
    if (documento) {
      toast.warn("Gerando o e-mail com o PDF do ingresso.");
      documentoGerado = await GerarPDFIngresso(compras);
      setDocumento(documentoGerado);
    }

    if (!documentoGerado) {
      documentoGerado = documento;
    }

    const form = new FormData();
    form.append("paymentMethod", tipoPagamento);
    form.append("file", documentoGerado);

    try {
      const response = await axios.post(
        `http://127.0.0.1:3210/v1/webhook/${idCompra}/payment-confirm`,
        form,
        {
          headers: {
            Authorization: `Bearer ${getToken()?.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 201) {
        router.replace("./SucessoCompra");
      }
    } catch (error) {
      toast.error("Não foi possível efetuar o pagamento. Tente novamente.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`orders/${idCompra}`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setCompras(response.data);
      } catch (error) {
        toast.error("Erro ao carregar os dados.");
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
      <SuporteTecnico role="Colaborador" />
      <div className="div_principal">
        <div className={styles.div_info_colaborador}>
          <div className="div_container_maior">
            <div>
              <div className="div_subtitulo">
                <h2>Informações do comprador</h2>
              </div>
              <div className={styles.div_secao_colaborador_pagamento}>
                <div className={styles.div_secao_colaborador_pagamento_info}>
                  <div
                    className={styles.div_secao_colaborador_pagamento_info_1}
                  >
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>Nome completo</label>
                      <br />
                      <span>{compras?.customer?.name}</span>
                    </div>
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>E-mail</label>
                      <br />
                      <span>{compras?.customer?.email}</span>
                    </div>
                  </div>
                  <div
                    className={styles.div_secao_colaborador_pagamento_info_2}
                  >
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>Nome do evento</label>
                      <br />
                      <span>{compras?.event?.name}</span>
                    </div>
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>Tipo de evento</label>
                      <br />
                      <span>{compras?.event?.category?.name}</span>
                    </div>
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>Data de início</label>
                      <br />
                      <span>
                        {new Date(
                          compras?.event?.initial_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>Data de término</label>
                      <br />
                      <span>
                        {new Date(
                          compras?.event?.final_date
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.label_info_comprador_colaborador}>
                      <label>Capacidade</label>
                      <br />
                      <span>{compras?.event?.capacity}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.corpo_secao_info_ingresso_financeiras}>
                  <div className="div_subtitulo">
                    <h2>Informações do tipo de ingresso</h2>
                  </div>
                  <div className={styles.div_info_financeiras_subtotal}>
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
              <hr />
              <div className="mb-3">
                <label>Data da compra</label>
                <br />
                <label>
                  {new Date(compras.created_at).toLocaleDateString()}
                </label>
              </div>
              <div className={styles.div_info_metodo_pagamento_colaborador}>
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
      </div>
      <ToastContainer />
    </div>
  );
}
