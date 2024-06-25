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
import Pagination from "@/components/Pagination/Pagination";

import { dateFormat, getStartOfDayTimestamp, getLastdayOfNextMonthTimestamp } from "@/utils";



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

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNationalChange = (event) => setNational(prev => !prev);

  const handleCategoryChange = (event) => setCategorySelected(event.target.value);

  const getQueryString = () => {

    let queryParams = {};

    // Adiciona 'filter' ao queryParams se searchTerm estiver definido e não vazio
    if (searchTerm) queryParams["filter"] = encodeURIComponent(searchTerm.trim());

    // Adiciona 'start-date' ao queryParams se dataInicio estiver definido e não vazio
    if (dataInicio) queryParams["start-date"] = new Date(dataInicio).getTime();

    // Adiciona 'end-date' ao queryParams se dataFim estiver definido e não vazio
    if (dataFim) queryParams["end-date"] = new Date(dataFim).getTime();

    // Adiciona 'category' ao queryParams se categorySelected estiver definido e não vazio
    if (categorySelected !== "" && categorySelected !== null && categorySelected !== undefined) {
      queryParams["category-id"] = categorySelected;
    };

    // Adiciona 'category' ao queryParams se categorySelected estiver definido e não vazio
    if (currentPage)
      queryParams["page"] = currentPage;

    // Adiciona 'national' ao queryParams
    queryParams["national"] = national.toString();

    let selectedStatesQuery = '';
    // Adiciona estados selecionados ao queryParams se 'national' for verdadeiro e selectedStates não estiver vazio
    if (national && selectedStates.length > 0) {
      selectedStatesQuery = selectedStates.reduce((acc, state, index) => {
        if (index === 0) return `uf=${state}`;
        else return `${acc}&uf=${state}`;
      }, '');
    }

    // Gera a query string final
    let queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    if (selectedStatesQuery) queryString = `${queryString}&${selectedStatesQuery}`
    console.log(queryString + selectedStatesQuery);
    return queryString;
  };

  const handleCheckboxChange = (e) => {
    const stateCode = e.target.value;
    setSelectedStates(prevSelectedStates => {
      if (e.target.checked)
        return [...prevSelectedStates, stateCode];
      else
        return prevSelectedStates.filter(code => code !== stateCode);
    });
  };

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
  const fetchData = async () => {
    try {
      const query = getQueryString()
      const response = await client.get(`/events?${query}`);
      if (response.data.total === 0)
        handleSetMessage("Nenhum evento encontrado com os critérios de busca. Por favor, tente ajustar seus filtros.", "success");

      setEventos(response.data.data);
      setTotalPages(response.data.totalPages);


    } catch (error) {
      console.log("Erro na requisição " + error);
    }
  };
  const handleSubmit = async () => {
    setCurrentPage(1);
    fetchData()
  }

  useEffect(() => { fetchData() }, [currentPage]);

  useEffect(() => {
    const initialDate = new Date(getStartOfDayTimestamp());
    const finalDate = new Date(getLastdayOfNextMonthTimestamp());
    setDataInicio(dateFormat(initialDate));
    setDataFim(dateFormat(finalDate));
    fetchData();
    client
      .get(`/categories`)
      .then((response) => { setCategorias(response.data.data) })
      .catch((error) => {
        console.log("Erro na requisição " + error);
      });
  }, []);

  return (
    <div id="div-principal">
      {console.log("RENDERIZOU A PÁGINA TODA")}
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
              onClick={handleSubmit}
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
              {/* <label>Período</label> */}
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
                  onChange={handleNationalChange}
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
                  onChange={handleNationalChange}
                />
              </div>
            </div>

            {national &&
              <StateFilter selectedStates={selectedStates} handleCheckboxChange={handleCheckboxChange} />}
          </div>
        </div>
        <div className={stylese.eventos}>
          {eventos.length == 0 ? (
            <div className={stylese.tabela_evento_nao_encontrado}>
              <label>Nenhum evento disponível encontrado.</label>
            </div>
          ) : (
            <div>
              <div className={"flex justify-end"}>
                {/* <label>
                  Página{" "}
                  {eventos.length / 6 <= 1 ? 1 : Math.ceil(eventos.length / 6)}{" "}
                  - {eventos.length <= 6 ? eventos.length : 6} de{" "}
                  {eventos.length} eventos.
                </label> */}
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
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
                                  {/* <li>
                                    <label>Nome da empresa</label>
                                  </li> */}
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