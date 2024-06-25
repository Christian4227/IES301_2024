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
import excluir from "../../../assets/excluir.png";
import Link from "next/link";
import { parseCookies } from "nookies";
import client from "@/utils/client_axios";
import {
  getFullAddress,
  formatDate,
  dateFormat,
  getStartOfDayTimestamp,
  getLastdayOfNextMonthTimestamp,
  getStatusClass,
  getStatusClassEvent,
} from "@/utils";
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

export default function IngressosCliente() {
  const router = useRouter();
  const [cotegories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [compras, setCompras] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipoCompra, setTipoCompra] = useState("");
  const [estrangeiro, setEstrangeiro] = useState(false);
  const [tipoEvento, setTipoEvento] = useState("");

  const AdicionarEventos = () => {
    router.push("../../InfoEventos");
  };

  const formatarStatusCompra = (estado_compra) => {
    switch (estado_compra) {
      case "PROCESSING":
        return "Processando";
      case "COMPLETED":
        return "Completado";
      case "CANCELLED":
        return "Cancelada";
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

  const handleCategoryChange = (event) => {
    setCategorySelected(event.target.value);
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const handleDeleteCompra = async (idCompra, indexItem) => {
    const resposta = window.confirm("Deseja deletar esta ordem de compra?");
    if (resposta == true) {
      try {
        let data = JSON.stringify({});
        const response = await client.post(`webhook/${idCompra}/cancel`, data, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        if (response.status == 201) {
          handleSetMessage("Ordem de compra excluída com sucesso!", "success");
          const novasCompras = compras.filter(
            (item, index) => index !== indexItem
          );
          setCompras(novasCompras);
        }
      } catch (error) {
        handleSetMessage("Erro ao deletar a ordem de compra.", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    }
  };

  const FiltrarTabelaOrdemCompra = async () => {
    var situacaoCompra = "";
    if (tipoCompra !== "") {
      situacaoCompra = "?order-status=" + tipoCompra;
    }

    var nacional = "";
    if (estrangeiro === "y") {
      if (situacaoCompra == "") {
        nacional = "?uf=SP";
      } else {
        nacional = "&uf=ES";
      }
    }

    var categoriaSelecionada = "";
    if (categorySelected !== "") {
      if (situacaoCompra == "" && nacional == "") {
        categoriaSelecionada = "?category-id=" + categorySelected;
      } else {
        categoriaSelecionada = "&category-id=" + categorySelected;
      }
    }

    // var situacaoDoEvento = ""; // No need to check for empty value here
    // if (tipoEvento !== "") {
    //   if (situacaoCompra == "" && nacional == "" && categoriaSelecionada == ""){
    //     situacaoDoEvento = "?status-id=" + tipoEvento;
    //   }
    //   else {
    //     situacaoDoEvento = "&status-id=" + tipoEvento;
    //   }
    // }

    var dataInicial = "";
    if (dataInicio !== "") {
      if (
        situacaoCompra == "" &&
        nacional == "" &&
        tipoEvento == "" &&
        categoriaSelecionada == ""
      ) {
        dataInicial = "?start-date=" + new Date(dataInicio).getTime();
      } else {
        dataInicial = "&start-date=" + new Date(dataInicio).getTime();
      }
    }

    var dataFinal = "";
    if (dataFim !== "") {
      dataFinal = "&end-date=" + new Date(dataFim).getTime();
    }

    const query =
      situacaoCompra +
      nacional +
      categoriaSelecionada +
      dataInicial +
      dataFinal;
    try {
      const response = await client.get(`orders/${query}`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 200) {
        handleSetMessage("Dados filtrados com sucesso.", "success");
        setCompras(response.data.data);
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar os dados", "error");
      console.log("Erro na requisição de pedidos:", error);
    }
  };

  // Componente da paginação
  const paginationButtons = [];
  for (let i = 1; i <= Math.ceil(compras.length / 6); i++) {
    paginationButtons.push(
      <li className="page-item" key={`pagination-${i}`}>
        <a className="page-link" href="#">
          {i}
        </a>
      </li>
    );
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.get("categories/", {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setCategories(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar as categorias", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get("orders/", {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setCompras(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar os dados", "error");
        console.log("Erro na requisição de pedidos:", error);
      }
    };
    fetchData();
    const initialDate = new Date(getStartOfDayTimestamp());
    const finalDate = new Date(getLastdayOfNextMonthTimestamp());
    setDataInicio(dateFormat(initialDate));
    setDataFim(dateFormat(finalDate));
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
                    <select
                      className="form-select"
                      onChange={(e) => setTipoCompra(e.target.value)}
                    >
                      <option value="">Selecione os status...</option>
                      <option value="PROCESSING">Processando</option>
                      <option value="COMPLETED">Completo</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Estrangeiro?</label>
                    <select
                      className="form-select"
                      defaultValue={"n"}
                      onChange={(e) => setEstrangeiro(e.target.value)}
                    >
                      <option value="y">Sim</option>
                      <option value="n">Não</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Tipo de evento</label>
                    <select
                      className="form-select"
                      value={categorySelected}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Tipo...</option>
                      {cotegories.length !== 0 &&
                        cotegories.map((categorie) => (
                          <option
                            key={`cat-${categorie.id}`}
                            value={`${categorie.id}`}
                          >
                            {categorie.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Situação do evento</label>
                    <select
                      className="form-select"
                      onChange={(e) => setTipoEvento(e.target.value)}
                    >
                      <option value="">Selecione o status do evento...</option>
                      <option value="PLANNED">Planejado</option>
                      <option value="IN_PROGRESS">Em progresso</option>
                      <option value="COMPLETED">Realizado</option>
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
                  <button
                    type="submit"
                    value="Pesquisar"
                    className="btn btn-primary"
                    onClick={() => FiltrarTabelaOrdemCompra()}
                  >
                    Pesquisar
                  </button>
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
                      <th colSpan={4}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.length <= 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          Nenhum dado foi encontrado.
                        </td>
                      </tr>
                    ) : (
                      compras.map((compra, index) => (
                        <tr key={`order-${index}`}>
                          <td>{compra.event.name}</td>
                          <td>{getFullAddress(compra.event.location)}</td>
                          <td>{formatDate(compra.event.initial_date)}</td>
                          <td>{formatDate(compra.event.final_date)}</td>
                          <td
                            className={getStatusClassEvent(compra.event.status)}
                          >
                            {formatarStatusEvento(compra.event.status)}
                          </td>
                          <td className={getStatusClass(compra.status)}>
                            {formatarStatusCompra(compra.status)}
                          </td>
                          <td>{formatDate(compra.created_at)}</td>
                          <td>
                            <Link
                              href={
                                compra.status === "PROCESSING"
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
                                  compra.status === "PROCESSING"
                                    ? styles.td_img_pag_sit_compra_processando
                                    : compra.status === "COMPLETED"
                                      ? styles.td_img_pag_sit_compra_completado
                                      : styles.td_img_pag_sit_compra_cancelado
                                }
                              />
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={
                                compra.status == "PROCESSING" ||
                                compra.status == "CANCELLED"
                                  ? "#"
                                  : `./IngressoClientePDF?idCompra=${compra.id}`
                              }
                            >
                              <Image
                                src={pdf}
                                alt="documento"
                                width={40}
                                height={40}
                                className={
                                  compra.status == "PROCESSING"
                                    ? styles.td_img_pdf_sit_compra_processando
                                    : compra.status == "COMPLETED"
                                      ? styles.td_img_pdf_sit_compra_completado
                                      : styles.td_img_pdf_sit_compra_cancelado
                                }
                              />
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`./MapsEventos?idEvento=${compra.event.id}`}
                            >
                              <Image
                                src={maps}
                                alt="mapa"
                                width={40}
                                height={40}
                              />
                            </Link>
                          </td>
                          <td>
                            <button
                              disabled={
                                compra.status == "CANCELLED" ? true : false
                              }
                              className={
                                compra.status == "CANCELLED"
                                  ? styles.td_button_compra_cancelada
                                  : styles.td_button_compra_disponivel
                              }
                              onClick={() =>
                                handleDeleteCompra(compra.id, index)
                              }
                            >
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
                    )}
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
