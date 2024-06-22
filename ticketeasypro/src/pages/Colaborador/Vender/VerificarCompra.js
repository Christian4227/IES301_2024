import React, { useEffect, useState } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Colaborador.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { emailRegex } from "@/utils";
import client from "@/utils/client_axios";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";
import carteira from "../../../assets/Carteira.png";
import excluir from "../../../assets/excluir.png";
import {
  getFullAddress,
  formatDate,
  getStatusClass,
  getStatusClassEvent,
} from "@/utils";

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
export default function VerificarCompra() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const isEmailValid = emailRegex.test(email);

    if (isEmailValid) {
      setIsFormValid(true);
    }
  }, [email]);

  const validateEmail = (email) => emailRegex.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const FiltrarPedidosCompra = async () => {
    try {
      const response = await client.get(
        `orders/email?customer-email=${email}`,
        {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        }
      );
      setCompras(response.data.data);
      if (response.status == 200) {
        handleSetMessage("Dados carregados com sucesso.", "success");
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar os dados", "error");
      console.log("Erro na requisição de pedidos:", error);
    }
  };

  const FormatarStatusCompra = (estado_compra) => {
    switch (estado_compra) {
      case "PROCESSING":
        return "Processando";
      case "COMPLETED":
        return "Completado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return;
    }
  };

  const formatarStatusCompra = (estado_compra) => {
    switch (estado_compra) {
      case "PROCESSING":
        return "Processando";
      case "COMPLETED":
        return "Completado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return "";
    }
  };

  const formatarStatusEvento = (estado_evento) => {
    switch (estado_evento) {
      case "PLANNED":
        return "Planejado";
      case "IN_PROGRESS":
        return "Em curso";
      case "COMPLETED":
        return "Realizado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return "";
    }
  };
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Compras do cliente" />
      <SuporteTecnico />
      <div className={styles.div_principal}>
        <div className="div_container_principal">
          <div>
            <div className={styles.div_titulo_tabela_colaborador}>
              <h3>Verificar compras do cliente</h3>
            </div>
            <div className={styles.div_filtros_verificar_compra}>
              <div className="mb-3">
                <label htmlFor="InputEmail" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  className={`form-control mb-4 ${!emailValid ? "is-invalid" : ""}`}
                  id="InputEmail"
                  value={email}
                  onChange={handleEmailChange}
                />
                {!emailValid && (
                  <i className="absolute text-red-600 text-sm -mt-6">
                    Por favor, insira um e-mail válido.
                  </i>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => FiltrarPedidosCompra()}
              disabled={!isFormValid}
            >
              Pesquisar
            </button>
          </div>
          <div className={styles.div_tabela_dados_colaborador}>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Nome do evento</th>
                  <th>Local do evento</th>
                  <th>Data do evento</th>
                  <th>Data término</th>
                  <th>Status evento</th>
                  <th>Sit. da compra</th>
                  <th>Data compra</th>
                  <th colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {compras.length > 0 ? (
                  compras.map((compra) => (
                    <tr key={`orderColaborador-${compra.index}`}>
                      <td>{compra.event.name}</td>
                      <td>{getFullAddress(compra.event.location)}</td>
                      <td>{formatDate(compra.event.initial_date)}</td>
                      <td>{formatDate(compra.event.final_date)}</td>
                      <td className={getStatusClassEvent(compra.event.status)}>
                        {formatarStatusEvento(compra.event.status)}
                      </td>
                      <td className={getStatusClass(compra.status)}>
                        {formatarStatusCompra(compra.status)}
                      </td>
                      <td
                        className={
                          compra.status == "PROCESSING"
                            ? styles.td_sit_compra_processando
                            : compra.status == "COMPLETED"
                              ? styles.td_sit_compra_completado
                              : styles.td_sit_compra_cancelado
                        }
                      >
                        {FormatarStatusCompra(compra.status)}
                      </td>
                      <td>
                        {new Date(compra.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <Link
                          href={
                            compra.status == "PROCESSING" ||
                            compra.status == "COMPLETED"
                              ? `./PagarCompraColaborador?idCompra=${compra.id}`
                              : "#"
                          }
                        >
                          <Image
                            src={carteira}
                            alt="carteira"
                            width={40}
                            height={40}
                          />
                        </Link>
                      </td>
                      <td>
                        <button>
                          <Image
                            src={excluir}
                            alt="excluir"
                            width={80}
                            height={80}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Nenhum dado foi encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
