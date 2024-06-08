import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import client from "@/utils/client_axios";
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const EmailConfirmation = ({ token, handleSetMessage, setLoading }) => {
  const router = useRouter();

  const setErrorMessage = useCallback(
    (message) => handleSetMessage(message, "error"),
    [handleSetMessage]
  );
  const setSuccessMessage = useCallback(
    (message) => handleSetMessage(message, "success"),
    [handleSetMessage]
  );

  const handleError = useCallback(
    (response) => {
      if (response?.data?.message) {
        const messageError = response.data.message;
        switch (messageError) {
          case "EmailAlreadyConfirmed":
            setSuccessMessage("Email já confirmado. Faça seu login.");
            setTimeout(() => router.push("/Login"), 3000);
            break;
          case "InvalidOrExpiredToken":
            setErrorMessage("Seu email de confirmação expirou.");
            setTimeout(() => router.push("/Contas/RecuperarEmail"), 3000);
            break;
          default:
            console.log(response);
            setErrorMessage("Erro desconhecido");
        }
      } else {
        setErrorMessage("Falha ao validar email. Por favor tente novamente.");
      }
    },
    [router, setErrorMessage, setSuccessMessage]
  );

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        const response = await client.get(
          `accounts/confirm-email?token=${encodeURIComponent(token)}`
        );
        if (response.status === 200) {
          setSuccessMessage("Email confirmado!");
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

    if (token) {
      validateToken();
    } else {
      router.push("/Contas/RecuperarEmail");
    }
  }, [token, router, setLoading, setSuccessMessage, handleError]);

  return null;
};

EmailConfirmation.propTypes = {
  token: PropTypes.string.isRequired,
  handleSetMessage: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default React.memo(EmailConfirmation);
