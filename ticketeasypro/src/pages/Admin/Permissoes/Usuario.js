import React, { useEffect, useState } from "react";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import styles from "@styles/Administracao.module.css";
import CabecalhoAdmin from "../CabecalhoAdmin";
import CabecalhoInfoAdmin from "../CabecalhoInfoAdmin";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import { getToken } from "@/utils";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

export default function Usuario() {
  const router = useRouter();

  const { nome, email, telefone, celular, role, id } = router.query;
  const [nomePagina, setNomePagina] = useState(null);
  const [emailPagina, setEmailPagina] = useState(null);
  const [telefonePagina, setTelefonePagina] = useState(null);
  const [celularPagina, setCelularPagina] = useState(null);
  const [rolePagina, setRolePagina] = useState(null);
  const [idUsuario, setIdUsuario] = useState("");
  const [dados, setDados] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role || "");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  useEffect(() => {
    if (nome && email && telefone && celular && role && id) {
      setDados(true);
      setSelectedRole(role); // Update selectedRole based on initial role
    }
  }, [nome, email, telefone, celular, role, id]);

  useEffect(() => {
    if (dados) {
      setNomePagina(nome);
      setEmailPagina(email);
      setTelefonePagina(telefone);
      setCelularPagina(celular);
      setRolePagina(selectedRole);
      setIdUsuario(id);
    }
  }, [dados, selectedRole]);

  const AtualizarPapel = async () => {
    let data = JSON.stringify({
      role: selectedRole,
    });
    try {
      const response = await client.put(`accounts/${idUsuario}/role`, data, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status == 200) {
        handleSetMessage(
          "Permissão do usuário atualizado com sucesso!",
          "success"
        );
      }
    } catch (error) {
      handleSetMessage("Erro ao atualizar o perfil", "error");
      console.log("Erro na requisição de accounts:", error);
    }
  };

  return (
    <div>
      <CabecalhoAdmin />
      <CabecalhoInfoAdmin secao="Permissões de usuários" />
      <SuporteTecnico role="Administrador"/>
      <div className="div_principal">
        <div className="div_formulario_container">
          <div className="div_container_maior">
            <div className="div_subtitulo">
              <h2>Formulário de permissão de acesso</h2>
            </div>
            <div className={styles.div_tabela_permissoes}>
              <div className={styles.div_tabela_permissoes_info}>
                <div className={styles.label_info_admin}>
                  <label>Nome</label>
                  <br />
                  <span>{nomePagina}</span>
                </div>
                <div className={styles.label_info_admin}>
                  <label>Email</label>
                  <br />
                  <span>{emailPagina}</span>
                </div>
                <div className={styles.label_info_admin}>
                  <label>Telefone</label>
                  <br />
                  <span>{telefonePagina}</span>
                </div>
                <div className={styles.label_info_admin}>
                  <label>Celular</label>
                  <br />
                  <span>{celularPagina}</span>
                </div>
                <div className={styles.label_info_admin}>
                  <label>Permissão do usuário</label>
                  <br />
                  <span>
                    {rolePagina === "SPECTATOR"
                      ? "Cliente"
                      : rolePagina === "STAFF"
                        ? "Colaborador"
                        : rolePagina === "EVENT_MANAGER"
                          ? "Organizador"
                          : "Administrador"}
                  </span>
                </div>
              </div>
              <div className={styles.div_tabela_permissoes_tabela}>
                <div className="div_tabela_dados">
                  <table className="table table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th>Administrador</th>
                        <th>Organizador</th>
                        <th>Colaborador</th>
                        <th>Cliente</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="radio"
                            name="role"
                            className="form-check-input"
                            value="ADMIN"
                            checked={selectedRole === "ADMIN"}
                            onChange={handleRoleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="radio"
                            name="role"
                            className="form-check-input"
                            value="EVENT_MANAGER"
                            checked={selectedRole === "EVENT_MANAGER"}
                            onChange={handleRoleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="radio"
                            name="role"
                            className="form-check-input"
                            value="STAFF"
                            checked={selectedRole === "STAFF"}
                            onChange={handleRoleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="radio"
                            name="role"
                            className="form-check-input"
                            value="SPECTATOR"
                            checked={selectedRole === "SPECTATOR"}
                            onChange={handleRoleChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => AtualizarPapel()}
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
