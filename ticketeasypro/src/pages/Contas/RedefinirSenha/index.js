import React, { useCallback, useState } from "react";
import PasswordAndConfirmForm from "@/components/forms/PasswordAndConfirmForm";
import Cabecalho from "@/pages/Cabecalho";
import CabecalhoHomeMenu from "@/pages/CabecalhoHomeMenu";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@styles/Home.module.css";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import LoadingOverlay from "@/components/LoadingOverlay";
import client from "@/utils/client_axios";
import { parseCookies } from "nookies";

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

const RedefinirSenha = () => {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const setLoadingWithDelay = (isLoading) => {
    if (isLoading) setLoading(true);
    else setTimeout(() => setLoading(false), 100);
  };

  const handleValidityChange = useCallback(
    (isValid) => {
      setIsPasswordValid(isValid);
    },
    [setIsPasswordValid]
  );

  const handlePasswordChange = useCallback(
    (newPassword, newConfirmPassword) => {
      setPassword(newPassword);
      setConfirmPassword(newConfirmPassword);
    },
    [setPassword, setConfirmPassword]
  );

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };

  const RedefinirSenhaBanco = async () => {
    try {
      setLoadingWithDelay(true);
      const cookie = getToken()?.accessToken;
      let data = JSON.stringify({
        token: cookie,
        newPassword: password,
      });
      await client.post("/accounts/reset-password", data);
      handleSetMessage("Dados atualizados com sucesso.", "success");
    } catch (error) {
      handleSetMessage("Usuário não logado. Tente novamente.", "error");
    } finally {
      setLoadingWithDelay(false);
    }
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isPasswordValid) {
        handleSetMessage("Senha alterada com sucesso!", "success");
      } else {
        handleSetMessage(
          "Erro ao alterar a sua senha. Tente novamente.",
          "success"
        );
      }
    },
    [isPasswordValid, confirmPassword, password]
  );

  return (
    <div>
      {loading && <LoadingOverlay />}
      <Cabecalho />
      <CabecalhoHomeMenu componente="Redefinição de senha" />
      <SuporteTecnico />
      <div className="div_principal">
        <div className={styles.div_form_redefinir_senha}>
          <div className="div_container_grande">
            <div className="div_subtitulo">
              <h2>Formulário de redefinição de senha</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <PasswordAndConfirmForm
                minStrength={2}
                onValidityChange={handleValidityChange}
                onPasswordChange={handlePasswordChange}
              />
              <div className={styles.div_form_botao_enviar}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isPasswordValid}
                  onClick={() => RedefinirSenhaBanco()}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
};

export default RedefinirSenha;
