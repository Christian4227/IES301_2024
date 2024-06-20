"use client";

import React, { useState, useEffect } from "react";
import CabecalhoCliente from "../CabecalhoCliente";
import CabecalhoInfoCliente from "../CabecalhoInfoCliente";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Cliente.module.css";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import carteira from "../../../assets/Carteira.png";
import pdf from "../../../assets/PDF.png";
import maps from "../../../assets/google_maps.png";
import Link from "next/link";
import { parseCookies } from "nookies";
import client from "@/utils/client_axios";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

export default function IngressosCliente() {
  const router = useRouter();
  const [compras, setCompras] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const AdicionarEventos = () => {
    router.push("../../InfoEventos");
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
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  // Componente da paginação
  const paginationButtons = [];
  for (let i = 1; i <= Math.ceil(compras.length / 6); i++) {
    paginationButtons.push(
      <li className="page-item">
        <a className="page-link" href="#">
          {i}
        </a>
      </li>
    );
  }

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
        const response = await client.get("orders/", {
          headers: { Authorization: `Bearer ${valorToken?.accessToken}` },
        });
        setCompras(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar os dados", "error");
        console.log("Erro na requisição " + error);
      }
    };
    fetchData();

    // Data dos formulários de filtro
    const now = new Date();
    var dia = now.getDate();
    dia = dia < 10 ? "0" + dia : dia;
    var mes = now.getMonth() + 1;
    mes = mes < 10 ? "0" + mes : mes;
    var ano = now.getFullYear();

    setDataInicio(ano + "-" + mes + "-" + dia);

    const nextMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último dia do próximo mês
    var diaFim = nextMonthLastDay.getDate();
    diaFim = diaFim < 10 ? "0" + diaFim : diaFim;
    var mesFim = nextMonthLastDay.getMonth() + 1;
    mesFim = mesFim < 10 ? "0" + mesFim : mesFim;
    var anoFim = nextMonthLastDay.getFullYear();

    setDataFim(anoFim + "-" + mesFim + "-" + diaFim);
  }, []);
  return (
    <div>
      <CabecalhoCliente />
      <CabecalhoInfoCliente secao="Compras Cliente" />
      <div className={styles.div_principal}>
        <SuporteTecnico />
        <div>
          <div className={styles.titulo_secao}>
            <h2>Seus eventos</h2>
          </div>
          <div className="div_container_principal">
            <div className={styles.div_titulo_tabela}>
              <h3>
                Informações das compras dos ingressos que já reservou ou comprou
              </h3>
              <input
                type="button"
                className={styles.botao_adicionar_eventos}
                value="Adicionar eventos"
                onClick={() => AdicionarEventos()}
              />
            </div>
            <div>
              <div>
                <div className={styles.form_ingressos_campos}>
                  <div className="mb-3">
                    <label>Situação da compra</label>
                    <select className="form-select">
                      <option value="">Selecione o status...</option>
                      <option value="PROCESSING">Processando</option>
                      <option value="COMPLETED">Completado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Estrangeiro?</label>
                    <select className="form-select">
                      <option value="Todos">Todos...</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Tipo de evento</label>
                    <select className="form-select"></select>
                  </div>
                  <div className="mb-3">
                    <label>Situação do evento</label>
                    <select className="form-select">
                      <option value="">Selecione o status do evento...</option>
                      <option value="PLANNED">Planejado</option>
                      <option value="IN_PROGRESS">Em progresso</option>
                      <option value="COMPLETED">Completado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className={styles.form_ingressos_campos}>
                  <div className="mb-3">
                    <label>Data de início</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Data final</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.div_botao_filtrar_ingressos}>
                  <input
                    type="button"
                    value="Pesquisar"
                    className="btn btn-primary"
                  />
                </div>
              </div>
              <div className={styles.div_tabela_dados}>
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
                      <th colSpan={3}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map((compra) => (
                      <tr key={`order-${compra.index}`}>
                        <td>{compra.nomeEvento}</td>
                        <td>{compra.localEvento}</td>
                        <td>{compra.dataevento}</td>
                        <td>{compra.dataevento}</td>
                        <td>{compra.situacaoIngresso}</td>
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
                              compra.status == "PROCESSING"
                                ? `./ComprarIngressoCliente?idCompra=${compra.id}`
                                : "#"
                            }
                          >
                            <Image
                              src={carteira}
                              alt="carteira"
                              width={40}
                              height={40}
                              className={
                                compra.status == "PROCESSING"
                                  ? styles.td_img_pag_sit_compra_processando
                                  : compra.status == "COMPLETED"
                                    ? styles.td_img_pag_sit_compra_completado
                                    : styles.td_img_pag_sit_compra_cancelado
                              }
                            />
                          </Link>
                        </td>
                        <td>
                          <Link
                            // href={
                            //   compra.status == "PROCESSING" ||
                            //   compra.status == "CANCELLED"
                            //     ? "#"
                            //     : `./CompraPDF?idCompra=${compra.id}`
                            // }
                            href={`./IngressoClientePDF?idCompra=${compra.id}`}
                          >
                            <Image
                              src={pdf}
                              alt="documento"
                              width={40}
                              height={40}
                              // className={
                              //   compra.status == "PROCESSING"
                              //     ? styles.td_img_pdf_sit_compra_processando
                              //     : compra.status == "COMPLETED"
                              //       ? styles.td_img_pdf_sit_compra_completado
                              //       : styles.td_img_pdf_sit_compra_cancelado
                              // }
                              className={
                                styles.td_img_pdf_sit_compra_completado
                              }
                            />
                          </Link>
                        </td>
                        <td>
                          <Link
                            href={`./MapsEventos?idEvento=${compra.event_id}`}
                          >
                            <Image
                              src={maps}
                              alt="mapa"
                              width={40}
                              height={40}
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.div_numero_paginacao_tabela}>
                  <label>
                    Página{" "}
                    {compras.length / 6 < 1 ? 1 : Math.ceil(compras.length / 6)}{" "}
                    - {compras.length <= 6 ? compras.length : 6} de{" "}
                    {compras.length} registros encontrados.
                  </label>
                </div>
                <div className={styles.div_paginacao_tabela}>
                  <nav aria-label="Navegação de página exemplo">
                    <ul className="pagination">
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Anterior
                        </a>
                      </li>
                      {paginationButtons}
                      <li className="page-item">
                        <a className="page-link" href="#">
                          Próximo
                        </a>
                      </li>
                    </ul>
                  </nav>
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
