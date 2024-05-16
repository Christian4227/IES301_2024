import React, { useEffect, useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/Home.module.css";
import stylese from "../styles/InfoEventos.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import torre from "../assets/torre_miroku.jpg";
import { useRouter } from "next/router";
// import client from "@/utils/client_axios";

export default function InfoEventos() {
    const router = useRouter();
    const [dados, setDados] = useState(null);
    const Filtrar = () => {
        alert("Filtrado");
    };
    const ReservarIngresso = () => {
        alert("Link reservar ingresso");
    };
    const VisualizarEvento = () => {
        router.push("/Evento.js");
    };

    useEffect(() => {
        setDados("");
    });

    return (
        <div id="div-principal">
            <Cabecalho className={styles.header} />
            <div id="div-principal">
                <div className={stylese.header_infoEventos}>
                    <h1>Eventos</h1>
                    <nav className={stylese.header_infoEventos_nav}>
                        <ul className={stylese.header_InfoEventos_menu}>
                            <Link href="./">
                                <li>Home</li>
                            </Link>
                            <Link href="./InfoTipoEvento">
                                <li>Tipo de evento</li>
                            </Link>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className={stylese.body}>
                <div className={stylese.filtros}>
                    <div className={stylese.filtros_titulo}>
                        <h1>Filtros</h1>
                    </div>
                    <hr />
                    <div className={stylese.filtros_conteudo}>
                        <div className={stylese.filtros_conteudo_1}>
                            <label className="form-label">Nome do evento</label>
                            <select
                                id="selectNomeEvento"
                                className="form-select"
                            ></select>
                            <label>Nome da empresa</label>
                            <select
                                id="selectNomeEmpresa"
                                className="form-select"
                            ></select>
                            <label className="form-label">Tipo de evento</label>
                            <select
                                id="selectTipoEvento"
                                className="form-select"
                            ></select>
                        </div>
                        <div className={stylese.filtros_conteudo_2}>
                            <label className="form-label">
                                Evento estrangeiro
                            </label>
                            <select
                                id="selectEventoEstrangeiro"
                                className="form-select"
                            >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                            <label>Capacidade</label>
                            <select
                                id="selectCapacidade"
                                className="form-select"
                            ></select>
                            <div className={stylese.filtros_conteudo_2_data}>
                                <label className="form-label">De</label>
                                <label className="form-label">Até</label>
                            </div>
                            <div className={stylese.filtros_conteudo_2_data}>
                                <input
                                    type="date"
                                    id="TxtDe"
                                    value=""
                                    className="form-control"
                                />
                                <input
                                    type="date"
                                    id="TxtAte"
                                    value=""
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            id="btnSubmeterFiltro"
                            className="btn btn-primary"
                            onClick={() => Filtrar()}
                        >
                            Filtrar
                        </button>
                    </div>
                </div>
                <hr />
                <div className={stylese.eventos}>
                    {dados === null ? (
                        <div className={stylese.tabela_evento_nao_encontrado}>
                            <label>Nenhum evento disponível encontrado.</label>
                        </div>
                    ) : (
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={stylese.tabela_eventos}>
                                            <div
                                                className={
                                                    stylese.secao_tabela_eventos_titulo
                                                }
                                            >
                                                <h2>Torre de Miroku</h2>
                                                <label>Cultural</label>
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            "black",
                                                        width: "100%",
                                                        height: "8px",
                                                        marginBottom: "10px",
                                                    }}
                                                ></div>
                                                <Image
                                                    src={torre}
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
                                                                Nome da empresa
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label>Local</label>
                                                        </li>
                                                        <li>
                                                            <label>Data</label>
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
                                                                Nome da empresa
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label>
                                                                Ribeirão Pires,
                                                                SP - Brasil
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label>
                                                                25/01/2024
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label>100</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <hr />
                                                <p>
                                                    *** Nota: confirme o seu
                                                    e-mail para receber o seu
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
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Menu id="menu-lateral" className={styles.menu_lateral} />
        </div>
    );
}
