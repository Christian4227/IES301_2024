import React, { useEffect, useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "@styles/Home.module.css";
import stylese from "../styles/InfoEventos.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "./Menu";
import Image from "next/image";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import CabecalhoHomeMenu from "./CabecalhoHomeMenu";

export default function InfoEventos() {
    const router = useRouter();
    const [dados, setDados] = useState([]);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const Filtrar = () => {
        alert("Filtrado");
    };
    const FiltroPeriodo = () => { };
    const FiltroCategoria = () => { };
    const FiltroCapacidade = () => { };
    const FiltroLocalidade = (estado, posicao, marcado) => {
        const listaEstados = [];

        if (marcado) {
            listaEstados.push({ estado: estado, posicao: posicao });
        } else {
            listaEstados.pop({ estado: estado, posicao: posicao });
        }

        console.log(listaEstados);

        return listaEstados;
    };
    const ReservarIngresso = () => {
        alert("Link reservar ingresso");
    };
    const VisualizarEvento = () => {
        router.push("/Evento.js");
    };

    useEffect(() => {
        client
            .get("/events/")
            .then((response) => {
                console.log(response.data);
                setDados(response.data.data);
            })
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
                            value="Buscar tudo"
                            onClick={() => Filtrar()}
                        />
                    </div>
                    <div className={stylese.secao_filtro}>
                        <div className={stylese.secao_filtro_titulo}>
                            <label>Período</label>
                        </div>
                        <div className="mb-3">
                            <label>De</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Até</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                            />
                        </div>
                        <input
                            type="button"
                            className="btn btn-primary"
                            onClick={() => FiltroPeriodo()}
                            defaultValue="Filtrar"
                        />
                    </div>
                    <hr />
                    <div className={stylese.secao_filtro}>
                        <div className={stylese.secao_filtro_titulo}>
                            <label>Categoria</label>
                        </div>
                        <div className="mb-3">
                            <label>Tipo de evento</label>
                            <select className="form-select"></select>
                        </div>
                        <input
                            type="button"
                            className="btn btn-primary"
                            onClick={() => FiltroCategoria()}
                            defaultValue="Filtrar"
                        />
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
                                    className="form-check-input"
                                />
                            </div>
                            <div className={stylese.secao_filtro_pais_tipo}>
                                <label>Internacional</label>
                                <input
                                    type="radio"
                                    className="form-check-input"
                                />
                            </div>
                        </div>
                        <div className={stylese.filtro_localidade_estado}>
                            <div
                                className={stylese.filtro_localidade_estado_col}
                            >
                                <div className="mb-3">
                                    <label>AC</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "AC",
                                                0,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>AL</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "AL",
                                                1,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>AP</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "AP",
                                                2,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>AM</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "AM",
                                                3,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>BA</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "BA",
                                                4,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>CE</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "CE",
                                                5,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>DF</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "DF",
                                                6,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>ES</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "ES",
                                                7,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>GO</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "GO",
                                                8,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>MA</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "MA",
                                                9,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                className={stylese.filtro_localidade_estado_col}
                            >
                                <div className="mb-3">
                                    <label>MT</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "MT",
                                                10,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>MS</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "MS",
                                                11,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>MG</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "MG",
                                                12,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>PA</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "PA",
                                                13,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>PB</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "PB",
                                                14,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>PR</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "PR",
                                                15,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>PE</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "PE",
                                                16,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>PI</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "PI",
                                                17,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>RJ</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "RJ",
                                                18,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>RN</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "RN",
                                                19,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                className={stylese.filtro_localidade_estado_col}
                            >
                                <div className="mb-3">
                                    <label>RS</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "RS",
                                                20,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>RO</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "RO",
                                                21,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>RR</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "RR",
                                                22,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>SC</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "SC",
                                                23,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>SP</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "SP",
                                                24,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>SE</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "SE",
                                                25,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>TO</label>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={(e) =>
                                            FiltroLocalidade(
                                                "TO",
                                                26,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <input
                            type="button"
                            className="btn btn-primary"
                            onClick={() => FiltroCapacidade()}
                            defaultValue="Filtrar"
                        />
                    </div>
                </div>
                <div className={stylese.eventos}>
                    {dados.length == 0 ? (
                        <div className={stylese.tabela_evento_nao_encontrado}>
                            <label>Nenhum evento disponível encontrado.</label>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <label>
                                    Página{" "}
                                    {dados.length / 6 <= 1
                                        ? 1
                                        : Math.ceil(dados.length / 6)}{" "}
                                    - {dados.length <= 6 ? dados.length : 6} de{" "}
                                    {dados.length} eventos.
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
                                        <tr
                                            className={
                                                stylese.tabela_eventos_body
                                            }
                                        >
                                            {dados.map((dado) => (
                                                <td key={dado.id}>
                                                    <div
                                                        className={
                                                            stylese.tabela_eventos
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                stylese.secao_tabela_eventos_titulo
                                                            }
                                                        >
                                                            <h2>{dado.name}</h2>
                                                            <label>
                                                                {
                                                                    dado
                                                                        .category
                                                                        .name
                                                                }
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <div
                                                                style={{
                                                                    backgroundColor:
                                                                        dado.color,
                                                                    width: "100%",
                                                                    height: "8px",
                                                                    marginBottom:
                                                                        "10px",
                                                                }}
                                                            ></div>
                                                            <Image
                                                                src={
                                                                    dado.img_thumbnail
                                                                }
                                                                height={250}
                                                                width={250}
                                                                alt="imagem1"
                                                                className={
                                                                    stylese.img_tabela_eventos
                                                                }
                                                            />
                                                        </div>
                                                        <div
                                                            className={
                                                                stylese.secao_tabela_eventos
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    stylese.tabela_eventos_info
                                                                }
                                                            >
                                                                <ul
                                                                    className={
                                                                        stylese.tabela_eventos_info_topico
                                                                    }
                                                                >
                                                                    <li>
                                                                        <label>
                                                                            Nome
                                                                            da
                                                                            empresa
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            Local
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            Data
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            Capacidade
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                                <ul>
                                                                    <li>
                                                                        <label>
                                                                            Ticket
                                                                            Easy
                                                                            Pro
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            {
                                                                                dado
                                                                                    .location
                                                                                    .name
                                                                            }
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            {new Date(
                                                                                dado.final_date
                                                                            ).toLocaleDateString()}
                                                                        </label>
                                                                    </li>
                                                                    <li>
                                                                        <label>
                                                                            {
                                                                                dado.capacity
                                                                            }
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <hr />
                                                            <p>
                                                                *** Nota:
                                                                confirme o seu
                                                                e-mail para
                                                                receber o seu
                                                                ingresso.
                                                            </p>
                                                            <div
                                                                className={
                                                                    stylese.tabela_eventos_botoes
                                                                }
                                                            >
                                                                <input
                                                                    type="button"
                                                                    id="btnReservar"
                                                                    className={
                                                                        stylese.botao_comprar
                                                                    }
                                                                    onClick={() =>
                                                                        ReservarIngresso()
                                                                    }
                                                                    value="Reservar"
                                                                />
                                                                <input
                                                                    type="button"
                                                                    id="btnVerMais"
                                                                    className={
                                                                        stylese.botao_ver
                                                                    }
                                                                    onClick={() =>
                                                                        VisualizarEvento()
                                                                    }
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
            <Menu id="menu-lateral" className={styles.menu_lateral} />
        </div>
    );
}
