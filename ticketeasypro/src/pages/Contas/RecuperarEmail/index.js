import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Cabecalho from "./../../Cabecalho";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailConfirmation from "@components/EmailConfirmation";
import EmailResendForm from "@components/forms/EmailResendForm";
import LoadingOverlay from "@components/LoadingOverlay";
import styleh from "@styles/Home.module.css";
import styles from "@styles/CadastroCliente.module.css";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import CabecalhoHomeMenu from "@/pages/CabecalhoHomeMenu";

const RecuperarEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = useCallback((message, type) => {
    setMessage({ text: message, type });
  }, []);

  useEffect(() => {
    if (loading) {
      setMessage({ text: "", type: "" });
    }
  }, [loading]);

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
          {!loading && token && (
            <EmailConfirmation
              token={token}
              handleSetMessage={handleSetMessage}
              setLoading={setLoadingWithDelay}
            />
          )}
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
