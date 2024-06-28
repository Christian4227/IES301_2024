import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/Colaborador.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import seta from "../../../assets/seta para cima.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Html5QrcodeScanner } from "html5-qrcode";
import client from "@/utils/client_axios";
import { getToken } from "@/utils";

import ToastMessage from "@/components/ToastMessage/ToastMessage";

const ScannerQrCode = () => {
  const router = useRouter();
  const [botao, setBotao] = useState(false);
  const [idIngresso, setIdIngresso] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const setErrorMessage = useCallback(
    (message) => setMessage({ text: message, type: "error" }),
    []
  );
  const setSuccessMessage = useCallback(
    (message) => setMessage({ text: message, type: "success" }),
    []
  );

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qrcode", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    function success(result) {
      scanner.pause();
      const regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUUID4 = regex.test(result);

      if (isUUID4) {
        const resposta = ValidarCodigo(result);

        if (resposta != "ok") {
          scanner.resume();
        } else {
          scanner.clear();
        }
      } else {
        setErrorMessage("Não foi encontrado o ingresso com este QR Code.");
      }
    }

    function error(err) {
      console.warn(err);
    }

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, []);

  const MenuValidar = () => {
    setBotao(!botao);
  };

  const ValidarCodigo = async (idIngresso) => {
    try {
      const response = await client.get(`tickets/${idIngresso}/checkin`, {
        headers: { Authorization: `Bearer ${getToken()?.accessToken}` },
      });
      if (response.status === 404) {
        setErrorMessage("Ingresso não existe.");
        return;
      }

      if (response.status === 200) {
        const mensagem = response?.data.fail;
        if (mensagem) {
          switch (mensagem) {
            case "TicketReservedPendingPayment":
              setErrorMessage("O ingresso/ordem de compra precisa ser pago.");
              return "nok";
            case "TicketHasBeenUsed":
              setErrorMessage("Esse ingresso já foi usado.");
              return "nok";
            case "TicketCancelled":
              setErrorMessage("Esse ingresso foi cancelado.");
              return "nok";
            case "TicketExpired":
              setErrorMessage("Esse ingresso está expirado.");
              return "nok";
          }
        }
        setSuccessMessage("Ingresso validado com sucesso!");
        setTimeout(() => {
          router.push("./SucessoValidacao");
        }, 7000);
        return "ok";
      }
    } catch (error) {
      setErrorMessage("Falha ao validar o ticket. Erro inesperado.");
    }
  };

  return (
    <div className={styles.body_qr_code}>
      <div id="qrcode" className={styles.qrcode_scanner}></div>
      <div>
        <div className={styles.embaixo}>
          <button className={styles.botao_img} onClick={() => MenuValidar()}>
            <Image src={seta} alt="" className={styles.img_botao} />
          </button>
          {botao ? (
            <div className={styles.botao_grupo}>
              <div className="mb-3">
                <label>Código do ingresso</label>
                <input
                  id="btnCodigoIngresso"
                  className="form-control"
                  type="text"
                  value={idIngresso}
                  onChange={(e) => setIdIngresso(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  id="btnCodigoIngresso"
                  className={styles.botao_codigo}
                  type="button"
                  value="Validar com código do ingresso"
                  onClick={() => ValidarCodigo(idIngresso)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {!!message.text && (
        <ToastMessage text={message.text} type={message.type} />
      )}
    </div>
  );
};
export default ScannerQrCode;
