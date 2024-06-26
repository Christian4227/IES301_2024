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

  const AdicionarEventos = () => {
    router.push("./EventoOrganizadorForm");
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  useEffect(() => {
    const fetchCategories = async () => {
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
        console.log(response.data.data);
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
    </div>
  );
}
