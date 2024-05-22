import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/Colaborador.module.css";
import { useRouter } from "next/router";
import CabecalhoColaborador from "./CabecalhoColaborador";
import CabecalhoInfoColaborador from "./CabecalhoInfoColaborador";

export default function ListaEventos() {
    const router = useRouter();
    const [evento, setEvento] = useState("");
    const [tipoEvento, setTipoEvento] = useState("");

    const ValidarIngresso = () => {
        if (tipoEvento == "" || evento == "") {
            alert("Selecione o tipo de evento e o evento.");
            return;
        }

        router.push("/Colaborador/ScannerQrCode");
    };
    return (
        <div>
            <CabecalhoColaborador />
            <CabecalhoInfoColaborador />
            <div className={styles.body_lista_colaborador}>
                <div className={styles.formulario_colaborador}>
                    <div className={styles.cabecalho}>
                        <h1>Validar ingressos</h1>
                        <label className={styles.subtitulo}>
                            Preencha os dados abaixo para validar o ingresso do
                            cliente.
                        </label>
                    </div>
                    <hr />
                    <div className={styles.formulario_campos_colaborador}>
                        <form>
                            <div className="form-group">
                                <label htmlFor="TxtTipoEvento">
                                    Tipo do evento
                                </label>
                                <select
                                    id="TxtTipoEvento"
                                    className="form-select"
                                    onChange={(e) =>
                                        setTipoEvento(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Selecione o tipo do evento...
                                    </option>
                                    <option value="Futebol">
                                        Palmeiras vs Inter de Limeira
                                    </option>
                                    <option value="Festas">Festas</option>
                                    <option value="Eventos culturais">
                                        Eventos culturais
                                    </option>
                                    <option value="Festivais">Festivais</option>
                                </select>
                                <br />
                                <label htmlFor="TxtNomeEvento">
                                    Nome do evento
                                </label>
                                <select
                                    id="TxtNomeEvento"
                                    className="form-select"
                                    onChange={(e) => setEvento(e.target.value)}
                                >
                                    <option value="">
                                        Selecione um evento...
                                    </option>
                                    <option value="Futebol">
                                        Palmeiras vs Inter de Limeira
                                    </option>
                                    <option value="Festas">
                                        Formatura da FATEC SP
                                    </option>
                                    <option value="Eventos culturais">
                                        Capoeira
                                    </option>
                                    <option value="Festivais">
                                        Festival do Japão 2024
                                    </option>
                                </select>
                                <br />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => ValidarIngresso()}
                                >
                                    Validar ingresso
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
