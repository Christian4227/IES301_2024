import React, { useContext, useEffect, useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "@styles/Home.module.css";
import stylese from "../styles/InfoEventos.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import Menu from "./Menu";
import Image from "next/image";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import CabecalhoHomeMenu from "./CabecalhoHomeMenu";
import { AuthContext } from "@/context/Auth";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import StateFilter from "@/components/StateFilter/StateFilter";

import {
  getFullAddress, formatDate, dateFormat, getStartOfDayTimestamp,
  getLastdayOfNextMonthTimestamp, getStatusClass, getStatusClassEvent
} from "@/utils";


export default function InfoEventos() {
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [national, setNational] = useState(true);
  const [selectedStates, setSelectedStates] = useState([]);


  const handleCategoryChange = (event) => setCategorySelected(event.target.key);

  const filtrarEventos = () => {
    console.log(selectedStates)
    let queryParams = {};

    // Adiciona 'filter' ao queryParams se searchTerm estiver definido e não vazio
    if (searchTerm) queryParams["filter"] = encodeURIComponent(searchTerm.trim());

    // Adiciona 'start-date' ao queryParams se dataInicio estiver definido e não vazio
    if (dataInicio) queryParams["start-date"] = dataInicio;

    // Adiciona 'end-date' ao queryParams se dataFim estiver definido e não vazio
    if (dataFim) queryParams["end-date"] = dataFim;

    // Adiciona 'category' ao queryParams se categorySelected estiver definido e não vazio
    if (categorySelected !== "" && categorySelected !== null && categorySelected !== undefined) {
      queryParams["category"] = encodeURIComponent(categorySelected.split("-")[1]);
    }

    // Adiciona 'national' ao queryParams
    queryParams["national"] = national.toString();

    // Adiciona estados selecionados ao queryParams se 'national' for verdadeiro e selectedStates não estiver vazio
    if (national && selectedStates.length > 0) {
      selectedStates.forEach((selectedState, index) => {
        queryParams[`uf[${index}]`] = selectedState;
      });
    }

    // Gera a query string final
    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    console.log(queryString);

    client
      .get(`/events/?${query}`)
      .then((response) => {
        setEventos(response.data.data);

        handleSetMessage("Filtro aplicado com sucesso.", "success");
      })
      .catch((error) => {
        handleSetMessage("Erro ao filtrar os eventos.", "error");
        console.log("Erro na requisição " + error);
      });
  };
  const handleCheckboxChange = (e) => {
    const stateCode = e.target.value;
    setSelectedStates(prevSelectedStates => {
      if (e.target.checked) {
        return [...prevSelectedStates, stateCode];
      } else {
        return prevSelectedStates.filter(code => code !== stateCode);
      }
    });
  };
  console.log(selectedStates);

  const ReservarIngresso = (idEvento) => {
    if (auth)
      router.push(`./Cliente/EventosCliente/EventoEscolhido?eventId=${idEvento}`);
    else
      router.push(`./Login?idEvento=${idEvento}`);
  };
  const visualizarEvento = (eventId) => {
    router.push(`/InfoTipoEvento?eventId=${eventId}`);
  };
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  const fecthData = async () => {
    client
      .get(
        `/events/?uf=SP&start-date=${dataInicio}}&end-date=${dataFim}`
      )
      .then((response) => {
        setEventos(response.data.data);
      })
      .catch((error) => {
        console.log("Erro na requisição " + error);
      });

  }
  useEffect(() => {

    const initialDate = new Date(getStartOfDayTimestamp());
    const finalDate = new Date(getLastdayOfNextMonthTimestamp());
    setDataInicio(dateFormat(initialDate));
    setDataFim(dateFormat(finalDate));
    fecthData()
    client
      .get(`/categories`)
      .then((response) => { setCategorias(response.data.data) })
      .catch((error) => {
        console.log("Erro na requisição " + error);
      });
  }, []);

  return (
    <div id="div-principal">
      <Cabecalho className={styles.header} />
      <CabecalhoHomeMenu componente={"Eventos"} />
      <div className={stylese.body}>
        <div className={stylese.filtro}>
          <div className={stylese.filtro_titulo}>
            <label>Filtro dos eventos</label>
          </div>
          <hr />
          <div className={stylese.div_botao_filtrar}>
            <input
              type="button"
              className={stylese.botao_filtrar}
              value="Buscar"
              onClick={() => filtrarEventos()}
            />
          </div>
          <div className={stylese.secao_filtro}>
            <div className="flex flex-col mt-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2 p-2 border border-gray-300 rounded-md"
                placeholder="Digite o nome do evento, descrição ou artista"
              />
            </div>
            <div className={stylese.secao_filtro_titulo}>
              <label>Período</label>
            </div>
            <div className="mb-3">
              <label>Período</label>
              <input
                type="date"
                className="form-control"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div className={stylese.secao_filtro}>
            <div className={stylese.secao_filtro_titulo}>
              <label>Categoria</label>
              <select className="form-select"
                value={categorySelected}
                onChange={handleCategoryChange}
              >
                <option value="">Selecione a categoria...</option>
                {categorias.length !== 0 &&
                  categorias.map((categoria) => (
                    <option key={`cat-${categoria.id}`} value={`${categoria.id}`} >
                      {categoria.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <hr />
          <div className={stylese.secao_filtro}>
            <div className={stylese.secao_filtro_titulo}>
              <label>Localidade</label>
            </div>
            <div className={stylese.secao_filtro_pais}>
              <div className={stylese.secao_filtro_pais_tipo}>
                <label>Nacional</label>
                <input
                  type="radio"
                  name="localidade"
                  className="form-check-input"
                  value="nacional"
                  checked={national}
                  onChange={() => setNational(national)}
                />
              </div>

              <div className={stylese.secao_filtro_pais_tipo}>
                <label>Internacional</label>
                <input
                  type="radio"
                  name="localidade"
                  className="form-check-input"
                  value="internacional"
                  checked={!national}
                  onChange={() => setNational(!national)}
                />
              </div>
            </div>
            <StateFilter selectedStates={selectedStates} handleCheckboxChange={handleCheckboxChange} />
          </div>
        </div>
        <div className={stylese.eventos}>
          {eventos.length == 0 ? (
            <div className={stylese.tabela_evento_nao_encontrado}>
              <label>Nenhum evento disponível encontrado.</label>
            </div>
          ) : (
            <div>
              <div>
                <label>
                  Página{" "}
                  {eventos.length / 6 <= 1 ? 1 : Math.ceil(eventos.length / 6)}{" "}
                  - {eventos.length <= 6 ? eventos.length : 6} de{" "}
                  {eventos.length} eventos.
                </label>
                <nav aria-label="Navegação de página exemplo">
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Anterior
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        Próximo
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div>
                <table>
                  <tbody>
                    <tr className={stylese.tabela_eventos_body}>
                      {eventos.map((dado) => (
                        <td key={dado.id}>
                          <div className={stylese.tabela_eventos}>
                            <div
                              className={stylese.secao_tabela_eventos_titulo}
                            >
                              <h2>{dado.name}</h2>
                              <label>{dado.category.name}</label>
                            </div>
                            <div>
                              <div
                                style={{
                                  backgroundColor:
                                    dado.color == undefined
                                      ? "#000000"
                                      : dado.color,
                                  width: "100%",
                                  height: "8px",
                                  marginBottom: "10px",
                                }}
                              ></div>
                              <Image
                                src={dado.img_thumbnail}
                                height={250}
                                width={250}
                                alt="imagem1"
                                className={stylese.img_tabela_eventos}
                              />
                            </div>
                            <div className={stylese.secao_tabela_eventos}>
                              <div className={stylese.tabela_eventos_info}>
                                <ul
                                  className={stylese.tabela_eventos_info_topico}
                                >
                                  <li>
                                    <label>Nome da empresa</label>
                                  </li>
                                  <li>
                                    <label>Local</label>
                                  </li>
                                  <li>
                                    <label>Data</label>
                                  </li>
                                  <li>
                                    <label>Capacidade</label>
                                  </li>
                                </ul>
                                <ul>
                                  <li>
                                    <label>Ticket Easy Pro</label>
                                  </li>
                                  <li>
                                    <label>{dado.location.name}</label>
                                  </li>
                                  <li>
                                    <label>
                                      {new Date(
                                        dado.final_date
                                      ).toLocaleDateString()}
                                    </label>
                                  </li>
                                  <li>
                                    <label>{dado.capacity}</label>
                                  </li>
                                </ul>
                              </div>
                              <hr />
                              <p>
                                *** Nota: confirme o seu e-mail para receber o
                                seu ingresso.
                              </p>
                              <div className={stylese.tabela_eventos_botoes}>
                                <input
                                  type="button"
                                  id="btnReservar"
                                  className={stylese.botao_comprar}
                                  onClick={() => ReservarIngresso(dado.id)}
                                  value="Reservar"
                                />
                                <input
                                  type="button"
                                  id="btnVerMais"
                                  className={stylese.botao_ver}
                                  onClick={() => visualizarEvento(dado.id)}
                                  value="Ver mais"
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}