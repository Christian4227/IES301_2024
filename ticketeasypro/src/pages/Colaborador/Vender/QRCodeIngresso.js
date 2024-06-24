import React, { useEffect, useState } from "react";
import CabecalhoColaborador from "../CabecalhoColaborador";
import CabecalhoInfoColaborador from "../CabecalhoInfoColaborador";
import styles from "@styles/Colaborador.module.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import SuporteTecnico from "@/components/Botoes/SuporteTecnico";
import ToastMessage from "@/components/ToastMessage/ToastMessage";
import { useRouter } from "next/router";

export default function QRCodeIngresso() {
  const router = useRouter();
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSetMessage = (message, type) => {
    setMessage({ text: message, type });
  };
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qrcode", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 100,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      const regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID4 = regex.test(result);

      if (isUUID4) {
        router.push(`./PagarCompraColaborador?idCompra=${result}`);
      } else {
        handleSetMessage(
          "Não foi encontrado o ingresso com este QR Code.",
          "error"
        );
      }
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);
  return (
    <div>
      <CabecalhoColaborador />
      <CabecalhoInfoColaborador secao="Vender ingresso QR Code" />
      <SuporteTecnico />
      <div className={styles.qrcode_scanner_body_imprimir}>
        <div id="qrcode" className={styles.qrcode_scanner_ingresso} />
      </div>
      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
}
