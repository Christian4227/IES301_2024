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

export default function InfoEventos() {
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const Filtrar = () => {
    alert("Filtrado");
  };
  const ReservarIngresso = (idEvento) => {
    if (auth) {
      router.push(
        `./Cliente/EventosCliente/EventoEscolhido?eventId=${idEvento}`
      );
    } else {
      router.push(`./Login?idEvento=${idEvento}`);
    }
  };
  const VisualizarEvento = () => {
    router.push("/InfoTipoEvento");
  };

  useEffect(() => {
    client
      .get("/events/?uf=SP")
      .then((response) => {
        setEventos(response.data.data);
      })
      .catch((error) => {
        console.log("Erro na requisição " + error);
      });

    client
      .get(`/categories`)
      .then((response) => {
        setCategorias(response.data.data);
      })
      .catch((error) => {
        console.log("Erro na requisição " + error);
      });

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
              onClick={() => Filtrar()}
            />
          </div>
          <div className={stylese.secao_filtro}>
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
              <select className="form-select">
                <option value="">Selecione a categoria...</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
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
                />
              </div>
              <div className={stylese.secao_filtro_pais_tipo}>
                <label>Internacional</label>
                <input
                  type="radio"
                  name="localidade"
                  className="form-check-input"
                />
              </div>
            </div>
            <div className={stylese.filtro_localidade_estado}>
              <div className={stylese.filtro_localidade_estado_col}>
                <div className="mb-3">
                  <label>AC</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>AL</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>AP</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>AM</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>BA</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>CE</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>DF</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>ES</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>GO</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>MA</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
              </div>
              <div className={stylese.filtro_localidade_estado_col}>
                <div className="mb-3">
                  <label>MT</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>MS</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>MG</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>PA</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>PB</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>PR</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>PE</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>PI</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>RJ</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>RN</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
              </div>
              <div className={stylese.filtro_localidade_estado_col}>
                <div className="mb-3">
                  <label>RS</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>RO</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>RR</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>SC</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>SP</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>SE</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
                <div className="mb-3">
                  <label>TO</label>
                  <input type="checkbox" className="form-check-input" />
                </div>
              </div>
            </div>
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
                                  onClick={() => VisualizarEvento()}
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
      {/* <Menu id="menu-lateral" className={styles.menu_lateral} /> */}
    </div>
  );
}
