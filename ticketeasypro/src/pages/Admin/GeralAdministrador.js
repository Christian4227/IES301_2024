import React, { useEffect, useState } from "react";
import CabecalhoAdmin from "./CabecalhoAdmin";
import CabecalhoInfoAdmin from "./CabecalhoInfoAdmin";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import Pagination from "@/components/Pagination/Pagination";
import client from "@/utils/client_axios";
import { getToken } from "@/utils";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Administracao.module.css";
import Image from "next/image";
import Link from "next/link";
import editar from "../../assets/Editar.png";

export default function IndexAdministrador() {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await client.get(`accounts/`, {
          headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
        });
        setUsuarios(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log("Erro na requisição de categorias:", error);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <div>
      <CabecalhoAdmin />
      <CabecalhoInfoAdmin secao="Página inicial" />
      <SuporteTecnico />
      <div className="div_principal">
        <div className="div_container_principal">
          <div className="div_tabela_dados">
            <div className={"flex justify-end"}>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Nome do usuário</th>
                  <th>Email</th>
                  <th>Email confirmado</th>
                  <th>Telefone</th>
                  <th>Celular</th>
                  <th>Papel</th>
                  <th>Permissão</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length <= 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      Nenhum dado foi encontrado.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario, index) => (
                    <tr key={`usuario-${index}`}>
                      <td>{usuario.name}</td>
                      <td>{usuario.email}</td>
                      <td
                        className={
                          usuario.email_confirmed == true
                            ? styles.td_usuario_confirmado
                            : styles.td_usuario_nao_confirmado
                        }
                      >
                        {usuario.email_confirmed == true ? "Sim" : "Não"}
                      </td>
                      <td>
                        {usuario.phone_fix == null ||
                        usuario.phone_fix.length == 0
                          ? "-"
                          : usuario.phone_fix}
                      </td>
                      <td>
                        {usuario.phone == null || usuario.phone.length == 0
                          ? "-"
                          : usuario.phone}
                      </td>
                      <td
                        className={
                          usuario.role == "SPECTATOR"
                            ? styles.td_usuario_cliente
                            : usuario.role == "STAFF"
                              ? styles.td_usuario_colaborador
                              : usuario.role == "EVENT_MANAGER"
                                ? styles.td_usuario_organizador
                                : styles.td_usuario_administrador
                        }
                      >
                        {usuario.role == "SPECTATOR"
                          ? "Cliente"
                          : usuario.role == "STAFF"
                            ? "Colaborador"
                            : usuario.role == "EVENT_MANAGER"
                              ? "Organizador"
                              : "Administrador"}
                      </td>
                      <td>
                        <td>
                          <Link
                            href={`./Permissoes/Usuario?nome=${usuario.name}&email=${usuario.email}&telefone=${usuario.phone_fix}&celular=${usuario.phone}&role=${usuario.role}&id=${usuario.id}`}
                          >
                            <Image
                              src={editar}
                              alt="editar"
                              width={40}
                              height={40}
                              className={styles.img_editar_usuarios}
                            />
                          </Link>
                        </td>
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
  );
}
