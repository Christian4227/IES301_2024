import React, { useState } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import Pagination from "@/components/Pagination/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Colaborador.module.css";
import { parseCookies } from "nookies";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import client from "@/utils/client_axios";
import { useRouter } from "next/router";
import { emailRegex } from "@/utils";

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

export default function VerificarIngresso() {
  const router = useRouter();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tickets, setTickets] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [idCompra, setIdCompra] = useState(0);
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const validateEmail = (email) => emailRegex.test(email);

  const CarregarIngressos = async () => {
    try {
      const response = await client.get(`orders/${idCompra}`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 200) {
        setIdCompra(response.data);
        handleSetMessage(
          "Dados dos tickets carregados com sucesso!",
          "success"
        );
        setTickets(response.data.data);
        setTotalPages(response.data.totalPages);
        console.log(response.data);
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar os tickets", "error");
      console.log("Erro na requisição de tickets:", error);
    }
  };

  const FiltrarEventos = async () => {
    try {
      const response = await client.get(
        `orders/email?customer-email=${email}&order-status=COMPLETED`,
        {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        }
      );
      if (response.status == 200) {
        handleSetMessage(
          "Dados dos tickets carregados com sucesso!",
          "success"
        );
        setEventos(response.data.data);
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar os eventos", "error");
      console.log("Erro na requisição de eventos:", error);
    }
  };
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Verificar ingresso" />
      <SuporteTecnico />
      <div className="div_principal">
        <div className="div_container_principal">
          <div className="div_subtitulo">
            <h2>Analisar ingressos</h2>
          </div>
          <div className={styles.form_evento_campos}>
            <div className={styles.form_evento_campos_data}>
              <div className={styles.form_evento_data}>
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

              <div className={styles.form_evento_botoes}>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Filtrar eventos"
                  disabled={!emailValid}
                  onClick={() => FiltrarEventos()}
                />
              </div>
            </div>
            <div className={styles.form_evento_campos_eventos}>
              <div className={styles.form_evento_campos_eventos_select}>
                <div className="mb-3">
                  <label>Tipo de evento</label>
                  <select
                    className="form-select"
                    onChange={(e) => setIdCompra(e.target.value)}
                  >
                    <option value="">Eventos...</option>
                    {eventos.length !== 0 &&
                      eventos.map((evento, index) => (
                        <option key={`cat-${index}`} value={`${evento.id}`}>
                          {evento.event.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={styles.form_evento_botoes}>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Buscar ingressos"
                  disabled={!idCompra}
                  onClick={() => CarregarIngressos()}
                />
              </div>
            </div>
          </div>

          <div className="div_tabela_dados">
            <div className={"flex justify-end"}>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Evento</th>
                  <th>Período</th>
                  <th>Data término</th>
                  <th>Sit. da compra</th>
                  <th>Status do ingresso</th>
                  <th>Validar</th>
                </tr>
              </thead>
              <tbody>
                {/* {tickets.length <= 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Nenhum dado foi encontrado.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={`tickets-${index}`}>
                      <td></td>
                    </tr>
                  ))
                )} */}
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
