import React, { useEffect } from "react";
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

export default function IngressosCliente() {
  const router = useRouter();
  // const [ingressos, setIngressos] = useState([]);
  const AdicionarEventos = () => {
    router.push("../EventosCliente/EventosGeraisCliente");
  };

  useEffect(() => {}, []);
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
                    <tr>
                      <td>Nome do evento</td>
                      <td>Local do evento</td>
                      <td>20/06/2024</td>
                      <td>24/06/2024</td>
                      <td>Usado</td>
                      <td>Em progresso</td>
                      <td>
                        <Image
                          src={carteira}
                          alt="carteira"
                          width={40}
                          height={40}
                        />
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
                        <Image src={maps} alt="mapa" width={40} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td>Nome do evento</td>
                      <td>Local do evento</td>
                      <td>20/06/2024</td>
                      <td>24/06/2024</td>
                      <td>Usado</td>
                      <td>Em progresso</td>
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
                          <Image src={maps} alt="mapa" width={40} height={40} />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                  {/* <tbody>
                    {ingressos.map((ingresso) => (
                      <tr key={ingresso.index}>
                        <td>{ingresso.nomeEvento}</td>
                        <td>{ingresso.localEvento}</td>
                        <td>{ingresso.dataevento}</td>
                        <td>{ingresso.situacaoIngresso}</td>
                        <td>{ingresso.statusevento}</td>
                        <td>
                          <Image
                            src={carteira}
                            alt="carteira"
                            width={40}
                            height={40}
                          />
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
                          <Image src={maps} alt="mapa" width={40} height={40} />
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
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
