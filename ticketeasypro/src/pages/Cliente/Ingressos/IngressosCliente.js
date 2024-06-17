import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import axios from "axios";

export default function IngressosCliente() {
  const router = useRouter();
  const [compras, setCompras] = useState([]);
  const AdicionarEventos = () => {
    router.push("../EventosCliente/EventosGeraisCliente");
  };

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMDJiZDc5Zi01YWZhLTQ3OTItYmI2Zi0xNDZiYmMzNTBhZjEiLCJsb2dpbiI6ImNocmlzdGlhbi5jdWJvQGZhdGVjLnNwLmdvdi5iciIsInJvbGUiOiJTUEVDVEFUT1IiLCJuYW1lIjoiQ2hyaXN0aWFuIFNhdGlvIEN1Ym8iLCJpYXQiOjE3MTg2NTUyMTEsImV4cCI6MTcxODY3NjgxMX0.5pdtUH-eU69yohvaD8B8FASxaUdLqyIE89oRiXvpkno";
    axios
      .get("http://127.0.0.1:3210/v1/orders/", {
        headers: {
          Cookie: `access_token=${token}`,
        },
      })
      .then((response) => {
        setCompras(response.data.data);
      })
      .catch((error) => {
        console.log("Erro na requisição " + error);
      });
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
                    <select className="form-select"></select>
                  </div>
                  <div className="mb-3">
                    <label>Estrangeiro?</label>
                    <select className="form-select">
                      <option value="Todos">Todos...</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Tipo de evento</label>
                    <select className="form-select"></select>
                  </div>
                  <div className="mb-3">
                    <label>Situação do evento</label>
                    <select className="form-select"></select>
                  </div>
                </div>
                <div className={styles.form_ingressos_campos}>
                  <div className="mb-3">
                    <label>Data de início</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Data final</label>
                    <input type="date" className="form-control" />
                  </div>
                </div>
                <div className={styles.div_botao_filtrar_ingressos}>
                  <input
                    type="button"
                    value="Pesquisar"
                    className="btn btn-primary"
                  />
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
                      <th>Sit. da compra</th>
                      <th>Status evento</th>
                      <th colSpan={3}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map((compra) => (
                      <tr key={compra.index}>
                        <td>{compra.nomeEvento}</td>
                        <td>{compra.localEvento}</td>
                        <td>{compra.dataevento}</td>
                        <td>{compra.situacaoIngresso}</td>
                        <td>{compra.statusevento}</td>
                        <td>
                          <Link href="./ComprarIngressoCliente">
                            <Image
                              src={carteira}
                              alt="carteira"
                              width={40}
                              height={40}
                            />
                          </Link>
                        </td>
                        <td>
                          <Image
                            src={pdf}
                            alt="documento"
                            width={40}
                            height={40}
                          />
                        </td>
                        <td>
                          <Link href="./MapsEventos">
                            <Image
                              src={maps}
                              alt="mapa"
                              width={40}
                              height={40}
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.div_numero_paginacao_tabela}>
                  <label>6 de 18 registros encontrados.</label>
                </div>
                <div className={styles.div_paginacao_tabela}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
