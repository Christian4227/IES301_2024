import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Cabecalho from "./../../Cabecalho";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailResendForm from "@components/forms/EmailResendForm";
import LoadingOverlay from "@components/LoadingOverlay";
import styleh from "@styles/Home.module.css";
import styles from "@styles/CadastroCliente.module.css";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import CabecalhoHomeMenu from "@/pages/CabecalhoHomeMenu";
import client from "@/utils/client_axios";

const RecuperarEmail = () => {
  const router = useRouter();
  const token = router.query.token;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = useCallback((message, type) => {
    setMessage({ text: message, type });
  }, []);

  // Mensagens de erro
  const handleError = (response) => {
    if (response?.data?.message) {
      const messageError = response.data.message;
      switch (messageError) {
        case "EmailAlreadyConfirmed":
          handleSetMessage("Email já confirmado. Faça seu login.", "error");
          setTimeout(() => router.push("/Login"), 3000);
          break;
        case "InvalidOrExpiredToken":
          handleSetMessage("Seu email de confirmação expirou.", "error");
          setTimeout(() => router.push("/Contas/RecuperarEmail"), 3000);
          break;
        default:
          handleSetMessage("Erro desconhecido", "error");
      }
    } else {
      handleSetMessage(
        "Falha ao validar email. Por favor tente novamente.",
        "error"
      );
    }
  };

  // Função para validar o token
  const validarToken = async () => {
    setLoading(true);
    try {
      const response = await client.get(
        `accounts/confirm-email?token=${encodeURIComponent(token)}`
      );
      if (response.status === 200) {
        handleSetMessage("Email confirmado!", "success");
        setTimeout(() => router.push("/Login"), 1750);
      } else {
        handleError(response);
      }
    } catch (error) {
      console.error("Erro na requisição para confirmar token:", error);
      handleError(error.response);
    } finally {
      setLoading(false);
    }
  };

  // Função para o efeito de carregamento
  useEffect(() => {
    if (loading) {
      setMessage({ text: "", type: "" });
    }
  }, [loading]);

  // Função para validar o token quando existir
  useEffect(() => {
    if (token) {
      validarToken();
    }
  }, [token]);

  const setLoadingWithDelay = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  return (
    <>
      <Cabecalho className={styleh.header} />
      <CabecalhoHomeMenu componente="Recuperar E-mail" />
      <div className={styles.divPrincipal_recuperar_email}>
        <div className="div_container_grande">
          {loading && <LoadingOverlay />}
          {!loading && !token && (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">
                  Não recebeu o e-mail de confirmação?
                </h1>
                <label className="block mb-4">
                  Digite novamente o seu e-mail no campo abaixo. Depois, clique
                  no botão <b>Reenviar</b>.
                </label>
              </div>
              <hr className="mb-4 bg-gray-300" />
              <EmailResendForm
                handleSetMessage={handleSetMessage}
                setLoading={setLoadingWithDelay}
              />
            </>
          )}
          {!!message.text && (
            <ToastMessage text={message.text} type={message.type} />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(RecuperarEmail);
