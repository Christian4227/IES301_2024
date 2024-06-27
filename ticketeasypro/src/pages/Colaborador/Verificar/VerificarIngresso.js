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
  // const [tickets, setTickets] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoEscolhido, setEventoEscolhido] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const CarregarIngressos = async () => {
    // try {
    //   const cookie = getToken()?.accessToken;
    //   if (!cookie) {
    //     handleSetMessage("Cookie expirado", "error");
    //     setTimeout(() => {
    //       router.replace("/");
    //     }, 6000);
    //   }
    //   const response = await client.get(`tickets/${eventoEscolhido}`, {
    //     headers: { Authorization: `Bearer ${cookie}` },
    //   });
    //   if (response.status == 200) {
    //     handleSetMessage(
    //       "Dados dos tickets carregados com sucesso!",
    //       "success"
    //     );
    //     setTickets(response.data);
    //     console.log(response.data);
    //   }
    // } catch (error) {
    //   handleSetMessage("Erro ao carregar os tickets", "error");
    //   console.log("Erro na requisição de tickets:", error);
    // }
  };

  const FiltrarEventos = async () => {
    try {
      const cookie = getToken()?.accessToken;

      if (!cookie) {
        handleSetMessage("Cookie expirado", "error");
        setTimeout(() => {
          router.replace("/");
        }, 6000);
      }
      const response = await client.get(
        `events/?start-date=${dataInicio}&final-date=${dataFim}`,
        {
          headers: { Authorization: `Bearer ${cookie}` },
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
                <div></div>
                <div></div>
                <div className="mb-3">
                  <label>Data de início</label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) =>
                      setDataInicio(new Date(e.target.value).getTime())
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Data final</label>
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) =>
                      setDataFim(new Date(e.target.value).getTime())
                    }
                  />
                </div>
              </div>
              <div className={styles.form_evento_botoes}>
                <input
                  type="button"
                  className="botao_sistema"
                  value="Filtrar eventos"
                  disabled={!(dataFim && dataInicio)}
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
                    value={eventoEscolhido}
                    onChange={(e) => setEventoEscolhido(e.target.value)}
                  >
                    <option value="">Eventos...</option>
                    {eventos.length !== 0 &&
                      eventos.map((evento) => (
                        <option key={`cat-${evento.id}`} value={`${evento.id}`}>
                          {evento.name}
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
                  disabled={!eventoEscolhido}
                  onClick={() => CarregarIngressos()}
                />
              </div>
            </div>
          </div>

          <div className="div_tabela_dados">
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Nome do cliente</th>
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
                      colSpan={7}
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
            {/* <div className={"flex justify-end"}>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div> */}
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
