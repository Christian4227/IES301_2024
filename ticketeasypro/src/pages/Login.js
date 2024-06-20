import React, { useContext, useState } from "react";
import styles from "@styles/Login.module.css";
import Link from "next/link";
import { AuthContext } from "@/context/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import ToastMessage from "@/components/ToastMessage/ToastMessage";

export default function Login() {
  const { login, retorno } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  const handleLogin = () => {
    try {
      login({ email: email, password: senha });
      if (retorno == 401) {
        handleSetMessage("Combinação de usuário ou senha incorretos.", "error");
      }
    } catch (error) {
      handleSetMessage("Erro desconhecido.", "error");
      console.error(error);
    }
  };

  return (
    <div className={styles.body_login_cliente}>
      <div className="div_container_pequeno">
        <div className={styles.div_Login_titulo}>
          <label>Área restrita</label>
          <hr />
        </div>
        <div className={styles.div_Login_campos}>
          <form>
            <div className="mb-3">
              <input
                id="txtEmail"
                type="email"
                className="form-control"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                id="txtSenha"
                type="password"
                className="form-control"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    // Chamar a função para acionar o clique no botão "Entrar"
                    handleLogin();
                  }
                }}
              />
            </div>
            <input
              id="btnEntrar"
              type="button"
              className="btn btn-primary"
              defaultValue="Entrar"
              onClick={handleLogin}
            />
          </form>
        </div>
        <hr />
        <div className={styles.div_Login_footer}>
          <label className={styles.descricao_cadastrar}>
            <b>Não tem uma conta? </b>
            <Link href="CadastroCliente" className={styles.link_cadastrar}>
              Cadastre-se
            </Link>
          </label>
        </div>
        {!!message.text && (
          <ToastMessage text={message.text} type={message.type} />
        )}
      </div>
    </div>
  );
}
