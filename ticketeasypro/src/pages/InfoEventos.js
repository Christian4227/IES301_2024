import React, { useEffect, useState } from "react";
import Cabecalho from "./Cabecalho";
import styles from "../styles/Home.module.css";
import stylese from "../styles/InfoEventos.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
// import torre from "../assets/torre_miroku.jpg";
import { useRouter } from "next/router";
// import client from "@/utils/client_axios";

export default function InfoEventos() {
    const router = useRouter();
    const [dados, setDados] = useState([]);
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
        setDados([
            {
                id: 1,
                name: "Show do Supla",
                description: "Show da Véio do Rock",
                initial_date: "2024-05-21T03:33:47.000Z",
                final_date: "2024-05-29T06:00:27.000Z",
                status: "PLANNED",
                base_price: 1450,
                capacity: 125,
                img_banner:
                    "https://plus.unsplash.com/premium_photo-1682855222843-0cd0827ed6e3",
                img_thumbnail:
                    "https://plus.unsplash.com/premium_photo-1682855222930-210943bfdd6c",
                color: "#FF5733",
                category: {
                    name: "Esportes",
                    description:
                        "Eventos esportivos incluindo futebol, basquete, etc.",
                },
                manager_id: "d78568d8-8ad4-4eda-9b61-9bb8dce74126",
                location: {
                    id: 2,
                    name: "Allianz Parque",
                    address_type: "Rua",
                    address: "Rua Palestra Itália",
                    number: "200",
                    zip_code: "05005-030",
                    city: "São Paulo",
                    uf: "SP",
                    country: "BRASIL",
                    complements: "Perdizes",
                    created_at: "2024-05-21T21:28:08.000Z",
                    updated_at: "2024-05-21T21:28:08.000Z",
                },
            },
            {
                id: 2,
                name: "Show de Eduardo",
                description: "Show da Véio do Rock",
                initial_date: "2024-05-21T03:33:47.000Z",
                final_date: "2024-05-29T06:00:27.000Z",
                status: "PLANNED",
                base_price: 1450,
                capacity: 125,
                img_banner:
                    "https://plus.unsplash.com/premium_photo-1682855222843-0cd0827ed6e3",
                img_thumbnail:
                    "https://plus.unsplash.com/premium_photo-1682855222930-210943bfdd6c",
                color: "#000000",
                category: {
                    name: "Esportes",
                    description:
                        "Eventos esportivos incluindo futebol, basquete, etc.",
                },
                manager_id: "d78568d8-8ad4-4eda-9b61-9bb8dce74126",
                location: {
                    id: 2,
                    name: "Allianz Parque",
                    address_type: "Rua",
                    address: "Rua Palestra Itália",
                    number: "200",
                    zip_code: "05005-030",
                    city: "São Paulo",
                    uf: "SP",
                    country: "BRASIL",
                    complements: "Perdizes",
                    created_at: "2024-05-21T21:28:08.000Z",
                    updated_at: "2024-05-21T21:28:08.000Z",
                },
            },
        ]);
    }, []);

    return (
        <div id="div-principal">
            <Cabecalho className={styles.header} />
            <div id="div-principal">
                <div className={stylese.header_infoEventos}>
                    <h1>Eventos</h1>
                    <nav className={stylese.header_infoEventos_nav}>
                        <ul className={stylese.header_InfoEventos_menu}>
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/InfoTipoEvento">
                                    Tipo de evento
                                </Link>
                            </li>
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
                                {dados.map((dado) => (
                                    <tr key={dado.id}>
                                        <td>
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
                                                        {dado.category.name}
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
                                                        src={dado.img_thumbnail}
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
                                                                    Nome da
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
                                                                    Ticket Easy
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
                                                        *** Nota: confirme o seu
                                                        e-mail para receber o
                                                        seu ingresso.
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
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Menu id="menu-lateral" className={styles.menu_lateral} />
        </div>
    );
}
