import React, { useEffect, useState } from "react";
import CabecalhoOrganizador from "../CabecalhoOrganizador";
import CabecalhoInfoOrganizador from "../CabecalhoInfoOrganizador";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Organizador.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import client from "@/utils/client_axios";
import maps from "../../../assets/google_maps.png";
import editar from "../../../assets/Editar.png";

import {
  getFullAddress,
  getStatusStringEvent,
  getStatusClassEvent,
} from "@/utils";
import Image from "next/image";
import Link from "next/link";
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

export default function GeralEventosOrganizador() {
  const router = useRouter();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [eventos, setEventos] = useState([]);
  const [cotegories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipoCompra, setTipoCompra] = useState("");
  const [estrangeiro, setEstrangeiro] = useState(false);
  const [tipoEvento, setTipoEvento] = useState("");

  const AdicionarEventos = () => {
    router.push("./EventoOrganizadorForm");
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const handleCategoryChange = (event) => {
    setCategorySelected(event.target.value);
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

    var situacaoDoEvento = ""; // No need to check for empty value here
    if (tipoEvento !== "") {
      if (
        situacaoCompra == "" &&
        nacional == "" &&
        categoriaSelecionada == ""
      ) {
        situacaoDoEvento = "?status=" + tipoEvento;
      } else {
        situacaoDoEvento = "&status=" + tipoEvento;
      }
    }

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
      situacaoDoEvento +
      dataInicial +
      dataFinal;
    try {
      const response = await client.get(`events/${query}`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 200) {
        handleSetMessage("Dados filtrados com sucesso.", "success");
        setEventos(response.data.data);
      }
    } catch (error) {
      handleSetMessage("Erro ao carregar os dados", "error");
      console.log("Erro na requisição de pedidos:", error);
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const hoje = new Date().getTime();
        const depois = new Date().getTime() + 5184000;
        const response = await client.get(
          `events/?initial_date=${hoje}&final_date=${depois}`,
          {
            headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
          }
        );
        setEventos(response.data.data);
      } catch (error) {
        handleSetMessage("Erro ao carregar as categorias", "error");
        console.log("Erro na requisição de categorias:", error);
      }
    };
    fetchEventos();
  }, []);

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
  return (
    <div>
      <CabecalhoOrganizador />
      <CabecalhoInfoOrganizador secao="Eventos gerais" />
      <SuporteTecnico />
      <div className="div_principal">
        <div className="div_container_principal">
          <div className="div_subtitulo">
            <h2>Eventos</h2>
            <input
              type="button"
              className={styles.botao_adicionar_eventos}
              value="Adicionar eventos"
              onClick={() => AdicionarEventos()}
            />
          </div>
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
                <option value="">Categoria...</option>
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
          <div>
            <div className="div_tabela_dados">
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Nome do evento</th>
                    <th>Categoria</th>
                    <th>Local do evento</th>
                    <th>Período</th>
                    <th>Status evento</th>
                    <th>Capacidade</th>
                    <th colSpan={3}></th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.length <= 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Nenhum dado foi encontrado.
                      </td>
                    </tr>
                  ) : (
                    eventos.map((evento, index) => (
                      <tr key={`evento-${index}`}>
                        <td>{evento.name}</td>
                        <td>{evento.category.name}</td>
                        <td>{getFullAddress(evento.location)}</td>
                        <td>
                          {new Date(evento.initial_date).toLocaleDateString() +
                            " - " +
                            new Date(evento.final_date).toLocaleDateString()}
                        </td>
                        <td className={getStatusClassEvent(evento.status)}>
                          {getStatusStringEvent(evento.status)}
                        </td>
                        <td>{evento.capacity}</td>
                        <td>
                          <Link
                            href={`./EventoOrganizadorForm?eventId=${evento.id}`}
                          >
                            <Image
                              src={editar}
                              alt="editar"
                              width={40}
                              height={40}
                            />
                          </Link>
                        </td>
                        <td>
                          <Link
                            href={`./MapsEventoOrganizador?idEvento=${evento.id}&lat=${evento.location.latitude}&long=${evento.location.longitude}`}
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
                    ))
                  )}
                </tbody>
              </table>
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
